using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Pulse.Unity.Transports;
using Unity.Profiling;
using UnityEngine;

namespace Pulse.Unity
{
    public sealed class UnityPulse
    {
        private bool _collecting;
        private int _sendBufferSize;
        private int _receiveBufferSize;
        private int _errorThreshold;
        private int _errorCount;
        private int _port;
        private float _collectInterval;
        private float _lastCollectTime;
        private string _host;
        
        private byte[] _session;
        private byte[] _identifier;
        private byte[] _version;
        private byte[] _platform;
        private byte[] _device;
        private long[] _recorderValues;

        private UdpTransport _transport;
        private List<ProfilerRecorder> _recorders;
        private UnityPulseLogHandler _logHandler;
        private readonly UnityPulseByteArrayPool _collectedPool = new(maxSize: 10);
        private const int ByteSize = 1;
        private const int IntSize = 4;
        private const int LongSize = 8;

        private readonly Dictionary<ProfilerCategory, string[]> _profileMetrics = new()
        {
            {
                ProfilerCategory.Memory, new[]
                {
                    "System Used Memory",
                    "Total Used Memory",
                    "GC Used Memory",
                    "Audio Used Memory",
                    "Video Used Memory",
                    "Profiler Used Memory"
                }
            },
            {
                ProfilerCategory.Render, new[]
                {
                    "SetPass Calls Count",
                    "Draw Calls Count",
                    "Total Batches Count",
                    "Triangles Count",
                    "Vertices Count",
                    "Render Textures Count",
                    "Render Textures Bytes",
                    "Render Textures Changes Count",
                    "Used Buffers Count",
                    "Used Buffers Bytes",
                    "Used Shaders Count",
                    "Vertex Buffer Upload In Frame Count",
                    "Vertex Buffer Upload In Frame Bytes",
                    "Index Buffer Upload In Frame Count",
                    "Index Buffer Upload In Frame Bytes",
                    "Shadow Casters Count"
                }
            }
        };
        
        public static UnityPulse Instance => _instance ??= new UnityPulse();
        private static UnityPulse _instance;

        private UnityPulse()
        {
            _sendBufferSize = 1024;
            _receiveBufferSize = 512;
            _errorThreshold = 5;
        }
        
        public UnityPulse SetDevice(string device)
        {
            if(string.IsNullOrEmpty(device))
                throw new ArgumentException("Device is empty");
            
            _logHandler?.LogInfo("Device set to: " + device);
            _device = Encoding.UTF8.GetBytes(device);
            return this;
        }
        
        public UnityPulse SetPlatform(string platform)
        {
            if(string.IsNullOrEmpty(platform))
                throw new ArgumentException("Platform is empty");
            
            _logHandler?.LogInfo("Platform set to: " + platform);
            _platform = Encoding.UTF8.GetBytes(platform);
            return this;
        }
        
        public UnityPulse SetVersion(string version)
        {
            if(string.IsNullOrEmpty(version))
                throw new ArgumentException("Version is empty");
            
            _logHandler?.LogInfo("Version set to: " + version);
            _version = Encoding.UTF8.GetBytes(version);
            return this;
        }
        
        public UnityPulse SetIdentifier(string identifier)
        {
            if(string.IsNullOrEmpty(identifier))
                throw new ArgumentException("Identifier is empty");
            
            _logHandler?.LogInfo("Identifier set to: " + identifier);
            _identifier = Encoding.UTF8.GetBytes(identifier);
            return this;
        }
        
        public UnityPulse SetInterval(float intervalSeconds)
        {
            _logHandler?.LogInfo("Collect interval set to: " + intervalSeconds);
            _collectInterval = intervalSeconds;
            return this;
        }
        
        public UnityPulse SetSendBufferSize(int size)
        {
            _logHandler?.LogInfo("Send buffer size set to: " + size);
            _sendBufferSize = size;
            return this;
        }
        
        public UnityPulse SetReceiveBufferSize(int size)
        {
            _logHandler?.LogInfo("Receive buffer size set to: " + size);
            _receiveBufferSize = size;
            return this;
        }
        
        public UnityPulse SetErrorThreshold(int threshold)
        {
            _logHandler?.LogInfo("Error threshold set to: " + threshold);
            _errorThreshold = threshold;
            return this;
        }
        
        public UnityPulse SetLogHandler(UnityPulseLogHandler logHandler)
        {
            _logHandler = logHandler;
            return this;
        }
        
        public UnityPulse SetDefaultLogger()
        {
            _logHandler = new UnityPulseLogHandler();
            _logHandler.LogInfo("Default logger set");
            return this;
        }
        
        public void Start(string host, int port)
        {
            if(string.IsNullOrEmpty(host))
                throw new ArgumentException("Host is empty");
            
            if(port <= 0)
                throw new ArgumentException("Port is invalid");
            
            _host = host;
            _port = port;
            _transport = new UdpTransport(_host, _port, _sendBufferSize, _receiveBufferSize);
            _logHandler?.LogInfo("Pulse started with host: " + _host + " and port: " + _port);
            
            StartRecorders();
            StartSession();
            
            _collecting = true;
        }

        public void Stop()
        {
            _collecting = false;
            
            StopSession();
            StopRecorders();
            
            _transport?.Dispose();
        }
        
        public void Collect()
        {
            if (!CanCollect())
                return;
            
            FillRecordValues();
            
            var bufferSize = ByteSize + IntSize + _session.Length + IntSize + _recorderValues.Length * LongSize;
            var buffer = _collectedPool.Get(bufferSize);
            
            var pulseData = new UnityPulseData(_session, _recorderValues);
            pulseData.Write(ref buffer);
            
            SendData(buffer);
            _collectedPool.Return(buffer);
            
            _logHandler?.LogInfo("Collected data");
        }
        
        public void Collect(byte[] key, long value)
        {
            if (!CanCollect())
                return;
            
            var bufferSize = ByteSize + IntSize + _session.Length + IntSize + key.Length + LongSize;
            var buffer = _collectedPool.Get(bufferSize);
            var pulseCustomData = new UnityPulseCustomData(_session, key, value);
            pulseCustomData.Write(ref buffer);
            
            SendData(buffer);
            _collectedPool.Return(buffer);
            
            _logHandler?.LogInfo("Collected custom data with key: " + Encoding.UTF8.GetString(key) + " and value: " + value);
        }

        public void Collect(byte[] key, long value, bool immediate)
        {
            if (!_collecting)
                return;
            
            var bufferSize = ByteSize + IntSize + _session.Length + IntSize + key.Length + LongSize;
            var buffer = _collectedPool.Get(bufferSize);
            var pulseCustomData = new UnityPulseCustomData(_session, key, value);
            pulseCustomData.Write(ref buffer);
            
            SendData(buffer);
            _collectedPool.Return(buffer);
            
            _logHandler?.LogInfo("Collected custom data with key: " + Encoding.UTF8.GetString(key) + " and value: " + value);
        }
        
        private void StartSession()
        {
            _session = Encoding.UTF8.GetBytes(Guid.NewGuid().ToString());
            
            var bufferSize = ByteSize + IntSize + _session.Length + IntSize + _identifier.Length + IntSize + _version.Length + IntSize + _platform.Length + IntSize + _device.Length;
            var buffer = _collectedPool.Get(bufferSize);
            
            var start = new UnityPulseSessionStart(_session, _identifier, _version, _platform, _device);
            start.Write(ref buffer);
            
            SendData(buffer);
            _collectedPool.Return(buffer);
            
            _logHandler?.LogInfo("Session started with id: " + Encoding.UTF8.GetString(_session));
        }

        private void StopSession()
        {
            var bufferSize = ByteSize + IntSize + _session.Length;
            var buffer = _collectedPool.Get(bufferSize);
            
            var stop = new UnityPulseSessionStop(_session);
            stop.Write(ref buffer);
            
            SendData(buffer);
            _collectedPool.Return(buffer);

            _collecting = false;
            
            _logHandler?.LogInfo("Session stopped with id: " + Encoding.UTF8.GetString(_session));
        }

        private void StartRecorders()
        {
            var recorderCount = _profileMetrics.Sum(x => x.Value.Length);
            _recorderValues = new long[recorderCount + 1];
            _recorders = new List<ProfilerRecorder>(recorderCount);
            
            foreach (var category in _profileMetrics.Keys)
                foreach (var metricName in _profileMetrics[category])
                    _recorders.Add(ProfilerRecorder.StartNew(category, metricName));
            
            _logHandler?.LogInfo("Started " + _recorders.Count + " recorders");
        }

        private void StopRecorders()
        {
            foreach (var recorder in _recorders)
            {
                recorder.Stop();
                recorder.Dispose();
            }
            
            _recorderValues = null;
            _logHandler?.LogInfo("Stopped " + _recorders.Count + " recorders");
        }
        
        private void SendData(byte[] data)
        {
            try
            {
                _transport?.SendData(data);
            }
            catch (Exception e)
            {
                _errorCount += 1;
                _logHandler?.LogError("Failed to send data: " + e.Message);
            }

            if (_errorCount >= _errorThreshold)
            {
                _collecting = false;
                _errorCount = 0;
                _logHandler?.LogWarning("Pulse stopped due to error threshold");
            }
        }

        private void FillRecordValues()
        {
            for (var i = 0; i < _recorders.Count; i++)
            {
                var r = _recorders[i];
                if (r is { Valid: true, IsRunning: true })
                {
                    _recorderValues[i] = _recorders[i].LastValue;
                }
                else
                {
                    _recorderValues[i] = 0;
                }
            }
            
            _recorderValues[^1] = GetFps();
        }

        private int GetFps()
        {
            return Mathf.RoundToInt(1.0f / Time.smoothDeltaTime);
        }

        private bool CanCollect()
        {
            if (!_collecting)
                return false;

            if (!(Time.realtimeSinceStartup - _lastCollectTime >= _collectInterval)) 
                return false;
            
            _lastCollectTime = Time.realtimeSinceStartup;
            return true;
        }
    }
}
