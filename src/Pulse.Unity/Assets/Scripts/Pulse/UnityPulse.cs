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
        private byte[] _buffer;
        private readonly int _secondInterval;
        private readonly int _port;
        private readonly string _host;
        private readonly byte[] _session;
        private readonly byte[] _identifier;
        private readonly byte[] _version;
        private readonly byte[] _platform;
        private readonly byte[] _device;
        private readonly long[] _recorderValues;
        
        private UdpTransport _transport;
        private readonly List<ProfilerRecorder> _recorders;
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
        
        public UnityPulse(string host, int port)
        {
            _buffer = new byte[256];
            
            _host = host;
            _port = port;
            _identifier = Encoding.UTF8.GetBytes(Application.identifier);
            _version = Encoding.UTF8.GetBytes(Application.version);
            _platform = Encoding.UTF8.GetBytes(Application.platform.ToString());
            _device = Encoding.UTF8.GetBytes(SystemInfo.deviceModel);
            _session = Encoding.UTF8.GetBytes(Guid.NewGuid().ToString());
            _secondInterval = 1;
            _collecting = false;
            
            var fpsMetric = 1;
            var recorderCount = _profileMetrics.Sum(x => x.Value.Length);
            _recorderValues = new long[recorderCount+fpsMetric];
            _recorders = new List<ProfilerRecorder>(recorderCount);
        }
        
        public void Start()
        {
            foreach (var category in _profileMetrics.Keys)
                foreach (var metricName in _profileMetrics[category])
                    _recorders.Add(ProfilerRecorder.StartNew(category, metricName));
            
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
            if(!_collecting)
                return;

            if (Time.frameCount % (_secondInterval * 60) != 0)
                return;

            FillRecordValues();
            ClearBuffer(_buffer);
            
            var pulseData = new UnityPulseData(_session, _recorderValues);
            lock(_buffer)
            {
                pulseData.Write(ref _buffer);
            }
            
            _ =  _transport?.SendData(_buffer);
        }

        public void Collect(byte[] key, long value)
        {
            if(!_collecting)
                return;
            
            if (Time.frameCount % (_secondInterval * 60) != 0)
                return;
            
            ClearBuffer(_buffer);
            
            var pulseCustomData = new UnityPulseCustomData(_session, key, value);
            lock(_buffer)
            {
                pulseCustomData.Write(ref _buffer);
            }
            
            _ =  _transport?.SendData(_buffer);
        }

        private void FillRecordValues()
        {
            for (var i = 0; i < _recorders.Count; i++)
                _recorderValues[i] = _recorders[i].LastValue;
            
            _recorderValues[^1] = GetFps();
        }

        private int GetFps()
        {
            return Mathf.RoundToInt(1.0f / Time.smoothDeltaTime);
        }
        
        private void StartSession()
        {
            var start = new UnityPulseSessionStart(_session, _identifier, _version, _platform, _device);

            lock (_buffer)
            {
                start.Write(ref _buffer);
            }
            
            _ = _transport.SendData(_buffer);
            _collecting = true;
            ClearBuffer(_buffer);
        }
        
        private void StopSession()
        {
            var stop = new UnityPulseSessionStop(_session);
            lock (_buffer)
            {
                stop.Write(ref _buffer);
            }
            _ = _transport.SendData(_buffer);
            ClearBuffer(_buffer);
        }
        
        private void StopRecorders()
        {
            foreach (var recorder in _recorders)
            {
                recorder.Stop();
                recorder.Dispose();
            }
        }
        
        private void ClearBuffer(byte[] buffer)
        {
            Array.Clear(buffer, 0, buffer.Length);
        }
    }
}