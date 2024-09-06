using Pulse.Unity;
using UnityEngine;
using Debug = UnityEngine.Debug;

namespace Example
{
    public class ExampleController : MonoBehaviour
    {
        private GameObject[] _cubes;
        private readonly byte[] _updateTimeKeyName = System.Text.Encoding.UTF8.GetBytes("update_time");
        private long _updateTime;
        
        public void Awake()
        {
            Application.targetFrameRate = 60;

            InstantiateRandomCube();
        }
        
        public void Start()
        {
            UnityPulse.Instance.Start("127.0.0.1",7771);
            Debug.Log("UnityPulse started");
        }
        
        public void Update()
        {
            for (var i = 0; i < 10; i++)
                RandomizePosition(_cubes[i]);
            
            UnityPulse.Instance.Collect();
            UnityPulse.Instance.Collect(_updateTimeKeyName, Random.Range(1,100));
        }
        
        public void OnDestroy()
        {
            UnityPulse.Instance.Stop();
            Debug.Log("UnityPulse stopped");
        }
        
        private void InstantiateRandomCube()
        {
            _cubes = new GameObject[10];
            
             for (var i = 0; i < 10; i++)
                 _cubes[i] = GameObject.CreatePrimitive(PrimitiveType.Cube);
        }
        
        private void RandomizePosition(GameObject obj, float minRange = -5f, float maxRange = 5f)
        {
            var position = new Vector3(
                Random.Range(minRange, maxRange), 
                Random.Range(minRange, maxRange), 
                Random.Range(minRange, maxRange)
            );
            obj.transform.position = position;
        }
    }
}