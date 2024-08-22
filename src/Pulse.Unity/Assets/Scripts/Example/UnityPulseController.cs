using UnityEngine;

namespace Pulse
{
    public class UnityPulseController : MonoBehaviour
    {
        private UnityPulse _pulse;
        
        public void Start()
        {
            Application.targetFrameRate = 60;
            
            _pulse = new UnityPulse("127.0.0.1", 7771);
            _pulse.Start();
        }
        
        public void Update()
        {
            _pulse.Collect();
        }

        public void OnDestroy()
        {
            _pulse.Stop();
        }
    }
}