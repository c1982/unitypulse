using System;

namespace Pulse
{
    internal readonly struct UnityPulseData
    {
        private readonly byte _msgType;
        private readonly byte[] _session;
        private readonly long[] _collectedData;
        
        public UnityPulseData(byte[] session, long[] data)
        {
            _msgType = 0x01;
            _session = session;
            _collectedData = data;
        }
        
        public void Write(ref byte[] buffer)
        {
            var offset = 0;
            var requiredSize = 1 + 4 + _session.Length + 4 + 8 * _collectedData.Length;
            if (buffer == null || buffer.Length < requiredSize)
            {
                buffer = new byte[requiredSize];
            }
            
            buffer[offset] = _msgType;
            offset += 1;

            BitConverter.TryWriteBytes(buffer.AsSpan(offset, 4), _session.Length);
            offset += 4;
            _session.CopyTo(buffer.AsSpan(offset));
            offset += _session.Length;

            BitConverter.TryWriteBytes(buffer.AsSpan(offset, 4), _collectedData.Length);
            offset += 4;

            for (var i = 0; i < _collectedData.Length; i++)
            {
                BitConverter.TryWriteBytes(buffer.AsSpan(offset, 8), _collectedData[i]);
                offset += 8;
            }
        }
    }
}