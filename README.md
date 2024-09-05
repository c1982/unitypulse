# UnityPulse

**Unity Continuous Benchmarking**

UnityPulse is a benchmarking tool designed to facilitate continuous performance testing for Unity projects. It enables developers to track performance metrics across different builds, ensuring that changes or updates in the project do not introduce unintended performance regressions.

## Features

- **Automated Benchmarking**: Automates the process of running performance tests across multiple builds.
- **Performance Tracking**: Tracks key performance metrics like frame rate, memory usage, and CPU utilization.
- **Comparison Across Builds**: Allows comparison of performance metrics between different builds to ensure optimal performance over time.
- **Lightweight Integration**: Easy to integrate into existing Unity projects with minimal setup.

## Getting Started

### Prerequisites

- Unity 2020 or higher
- Go 1.16+ (required for backend scripts)
- Basic knowledge of Unity's performance profiling tools

### Installation

0. Open Unity Packer Manager
1. Add package from git URL
2. Enter this URL:
    https://github.com/c1982/unitypulse.git?path=/src/Pulse.Unity/Assets/Scripts/Pulse   

### Usage

```csharp
using Pulse;
using UnityEngine;
using Debug = UnityEngine.Debug;

namespace Example
{
    public class ExampleController : MonoBehaviour
    {
        private UnityPulse _pulse;
        private readonly byte[] _updateTimeKeyName = System.Text.Encoding.UTF8.GetBytes("update_time");
        private long _updateTime;
        
        public void Awake()
        {
            _pulse = UnityPulse.Instance.SetTargetFrameRate(Application.targetFrameRate);
        }
        
        public void Start()
        {
            _pulse.Start("127.0.0.1",7771);
            Debug.Log("UnityPulse started");
        }
        
        public void Update()
        {
            _pulse.Collect();
            _pulse.Collect(_updateTimeKeyName, Random.Range(1,100));
        }
        
        public void OnDestroy()
        {
            _pulse.Stop();
            Debug.Log("UnityPulse stopped");
        }
    }
}
```
