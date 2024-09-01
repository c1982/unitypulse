using Pulse;
using UnityEngine;

namespace Example
{
    public class UnityPulseController : MonoBehaviour
    {
        private UnityPulse _pulse;
        private byte[] serializationTimeKeyName;
        public void Awake()
        {
            Application.targetFrameRate = 60;
            
            serializationTimeKeyName = System.Text.Encoding.UTF8.GetBytes("serialization_time");
            _pulse = new UnityPulse("127.0.0.1", 7771);
            _pulse.Start();
        }
        
        public void Update()
        {
            _pulse.Collect();
            _pulse.Collect(serializationTimeKeyName, 1024);
        }

        public void OnDestroy()
        {
            _pulse.Stop();
        }
    }
}