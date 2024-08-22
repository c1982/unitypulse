using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Pulse.Transports;
using Unity.Profiling;
using UnityEngine;

namespace Pulse
{
    public class UnityPulse
    {
        private bool _collecting;
        private Process _process;
        private UdpTransporter _transporter;

        private readonly string _host;
        private readonly string _identifier;
        private readonly string _version;
        private readonly string _platform;
        private readonly string _device;
        private readonly string _session;
        private readonly int _secondInterval;
        private readonly int _port;
        private readonly long[] _recorderValues;
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
            _host = host;
            _port = port;
            _identifier = Application.identifier;
            _version = Application.version;
            _platform = Application.platform.ToString();
            _device = SystemInfo.deviceModel;
            _session = System.Guid.NewGuid().ToString();
            _secondInterval = 1;
            _collecting = false;
            
            const int fpsMetric = 1;
            var recorderCount = _profileMetrics.Sum(x => x.Value.Length);
            _recorderValues = new long[recorderCount+fpsMetric];
            _recorders = new List<ProfilerRecorder>(recorderCount);
        }
        
        public void Start()
        {
            foreach (var category in _profileMetrics.Keys)
                foreach (var metricName in _profileMetrics[category])
                    _recorders.Add(ProfilerRecorder.StartNew(category, metricName));
            
            _process = Process.GetCurrentProcess();
            _transporter = new UdpTransporter(_host, _port);
            
            _collecting = true;
        }
        
        public void Stop()
        {
            _collecting = false;
            
            foreach (var recorder in _recorders)
            {
                recorder.Stop();
                recorder.Dispose();
            }
            
            _transporter.Dispose();
        }
        
        public void Collect()
        {
            if(!_collecting)
                return;

            if (Time.frameCount % (_secondInterval * 60) != 0)
                return;
            
            for (var i = 0; i < _recorders.Count; i++)
                _recorderValues[i] = _recorders[i].LastValue;

            _recorderValues[^1] = GetFps();
            
            var pulseData = new UnityPulseData(_session, _identifier, _version, _platform, _device, _recorderValues);
            var bytes = pulseData.ToBytes();
            
            _ =  _transporter.SendDataAsync(bytes);
        }

        private int GetFps()
        {
            return Mathf.RoundToInt(1.0f / Time.smoothDeltaTime);
        }
    }
}