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
        
        public byte[] ToBytes()
        {
            int totalSize = 1 + 4 + _session.Length + 4 + 8 * _collectedData.Length;
            Span<byte> buffer = totalSize <= 256 ? stackalloc byte[totalSize] : new byte[totalSize];

            int offset = 0;

            buffer[offset] = _msgType;
            offset += 1;

            BitConverter.TryWriteBytes(buffer.Slice(offset, 4), _session.Length);
            offset += 4;
            _session.CopyTo(buffer.Slice(offset));
            offset += _session.Length;

            BitConverter.TryWriteBytes(buffer.Slice(offset, 4), _collectedData.Length);
            offset += 4;

            for (int i = 0; i < _collectedData.Length; i++)
            {
                BitConverter.TryWriteBytes(buffer.Slice(offset, 8), _collectedData[i]);
                offset += 8;
            }

            return buffer.ToArray();
        }
    }
}