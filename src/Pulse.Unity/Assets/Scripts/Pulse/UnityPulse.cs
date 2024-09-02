using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Pulse.Transports;
using Unity.Profiling;
using UnityEngine;

namespace Pulse
{
    public sealed class UnityPulse
    {
        private bool _collecting;
        private readonly int _secondsInterval;
        private readonly int _port;
        private readonly int _targetFrameRate;
        private readonly string _host;
        private readonly byte[] _session;
        private readonly byte[] _identifier;
        private readonly byte[] _version;
        private readonly byte[] _platform;
        private readonly byte[] _device;
        private readonly long[] _recorderValues;

        private UdpTransport _transport;
        private readonly List<ProfilerRecorder> _recorders;
        private readonly UnityPulseByteArrayPool _collectedPool = new(maxSize: 1024);
        
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

        public UnityPulse(string host, int port, int targetFrameRate)
        {
            _host = host;
            _port = port;
            _secondsInterval = 1;
            _collecting = false;
            _targetFrameRate = targetFrameRate;
            _identifier = Encoding.UTF8.GetBytes(Application.identifier);
            _version = Encoding.UTF8.GetBytes(Application.version);
            _platform = Encoding.UTF8.GetBytes(Application.platform.ToString());
            _device = Encoding.UTF8.GetBytes(SystemInfo.deviceModel);
            _session = Encoding.UTF8.GetBytes(Guid.NewGuid().ToString());

            var fpsMetric = 1;
            var recorderCount = _profileMetrics.Sum(x => x.Value.Length);
            _recorderValues = new long[recorderCount + fpsMetric];
            _recorders = new List<ProfilerRecorder>(recorderCount);
        }

        public void Start()
        {
            StartRecorders();
            _transport = new UdpTransport(_host, _port);
            StartSession();
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
            
            _transport?.SendData(buffer);
            _collectedPool.Return(buffer);
        }

        public void Collect(byte[] key, long value)
        {
            if (!CanCollect()) 
                return;
            
            var bufferSize = ByteSize + IntSize + _session.Length + IntSize + key.Length + LongSize;
            var buffer = _collectedPool.Get(bufferSize);
            
            var pulseCustomData = new UnityPulseCustomData(_session, key, value);
            pulseCustomData.Write(ref buffer);
            
            _transport?.SendData(buffer);
            _collectedPool.Return(buffer);
        }

        private void StartSession()
        {
            var bufferSize = ByteSize + IntSize + _session.Length + IntSize + _identifier.Length + IntSize + _version.Length + IntSize + _platform.Length + IntSize + _device.Length;
            var buffer = _collectedPool.Get(bufferSize);
            
            var start = new UnityPulseSessionStart(_session, _identifier, _version, _platform, _device);
            start.Write(ref buffer);
            
            _transport?.SendData(buffer);
            _collectedPool.Return(buffer);
            
            _collecting = true;
        }

        private void StopSession()
        {
            var bufferSize = ByteSize + IntSize + _session.Length;
            var buffer = _collectedPool.Get(bufferSize);
            
            var stop = new UnityPulseSessionStop(_session);
            stop.Write(ref buffer);
            
            _transport?.SendData(buffer);
            _collectedPool.Return(buffer);

            _collecting = false;
        }

        private void StartRecorders()
        {
            foreach (var category in _profileMetrics.Keys)
            {
                foreach (var metricName in _profileMetrics[category])
                {
                    _recorders.Add(ProfilerRecorder.StartNew(category, metricName));
                }
            }
        }

        private void StopRecorders()
        {
            foreach (var recorder in _recorders)
            {
                recorder.Stop();
                recorder.Dispose();
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
            return _collecting && Time.frameCount % (_secondsInterval * _targetFrameRate) == 0;
        }
        
    }
}
