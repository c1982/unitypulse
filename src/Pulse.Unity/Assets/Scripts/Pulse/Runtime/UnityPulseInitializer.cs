using UnityEngine;

namespace Pulse.Unity
{
    public static class UnityPulseInitializer
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]
        public static void Init()
        {
            UnityPulse.Instance
                .SetIdentifier(Application.identifier)
                .SetPlatform(Application.platform.ToString())
                .SetVersion(Application.version)
                .SetDevice(SystemInfo.deviceName)
                .SetSendBufferSize(1024)
                .SetErrorThreshold(5)
                .SetInterval(1f);
        }
    }
}