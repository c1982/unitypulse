using UnityEngine;

namespace Pulse.Unity
{
    public interface IUnityPulseLogger
    {
        void LogInfo(string message);
        void LogWarning(string message);
        void LogError(string message);
    }
    
    public class UnityPulseLogHandler
    {
        private readonly IUnityPulseLogger _logger;
        
        public UnityPulseLogHandler(IUnityPulseLogger customLogger = null)
        {
            _logger = customLogger ?? new DefaultUnityPulseLogger();
        }

        public void LogInfo(string message)
        {
            _logger.LogInfo(message);
        }

        public void LogWarning(string message)
        {
            _logger.LogWarning(message);
        }

        public void LogError(string message)
        {
            _logger.LogError(message);
        }
    }
    
    public class DefaultUnityPulseLogger : IUnityPulseLogger
    {
        public void LogInfo(string message)
        {
            Debug.Log($"[PULSE] {message}");
        }

        public void LogWarning(string message)
        {
            Debug.LogWarning($"[PULSE] {message}");
        }

        public void LogError(string message)
        {
            Debug.LogError($"[PULSE] {message}");
        }
    }
    
}