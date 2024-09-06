using UnityEngine;

namespace Pulse.Unity
{
    public static class UnityPulseInitializer
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]
        public static void Init()
        {
            UnityPulse.Instance.SetInterval(1f);
        }
    }
}