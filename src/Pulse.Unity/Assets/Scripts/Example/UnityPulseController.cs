using Pulse;
using UnityEngine;

namespace Example
{
    public class UnityPulseController : MonoBehaviour
    {
        private UnityPulse _pulse;
        private byte[] _serializationTimeKeyName;
        
        public void Awake()
        {
            Application.targetFrameRate = 60;
            
            _serializationTimeKeyName = System.Text.Encoding.UTF8.GetBytes("serialization_time");
            
            _pulse = new UnityPulse("127.0.0.1", 7771, Application.targetFrameRate);
            _pulse.Start();
            Debug.Log("UnityPulse started");
        }
        
        public void FixedUpdate()
        {
            _pulse.Collect();
            _pulse.Collect(_serializationTimeKeyName, 5000);
        }

        public void OnDestroy()
        {
            _pulse.Stop();
            Debug.Log("UnityPulse stopped");
        }
    }
}