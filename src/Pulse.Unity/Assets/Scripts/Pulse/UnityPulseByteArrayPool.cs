namespace Pulse
{
    using System.Buffers;
    
    public class UnityPulseByteArrayPool
    {
        private readonly ArrayPool<byte> _pool;
        private readonly object _lock = new();
        
        public UnityPulseByteArrayPool(int maxSize)
        {
            _pool = ArrayPool<byte>.Create(maxSize, 1024);
        }
        
        public byte[] Get(int size)
        {
            lock (_lock)
            {
                return _pool.Rent(size);
            }
        }
        
        public void Return(byte[] item)
        {
            lock (_lock)
            {
                _pool.Return(item, clearArray: true);
            }
        }
    }
}