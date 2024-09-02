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

    internal readonly struct UnityPulseCustomData
    {
        private readonly byte _msgType;
        private readonly byte[] _session;
        private readonly byte[] _key;
        private readonly long _value;

        public UnityPulseCustomData(byte[] session, byte[] key, long value)
        {
            _msgType = 0x03;
            _session = session;
            _key = key;
            _value = value;
        }

        public void Write(ref byte[] buffer)
        {
            var offset = 0;
            buffer[offset] = _msgType;
            offset += 1;

            BitConverter.TryWriteBytes(buffer.AsSpan(offset, 4), _session.Length);
            offset += 4;
            _session.CopyTo(buffer.AsSpan(offset));
            offset += _session.Length;

            BitConverter.TryWriteBytes(buffer.AsSpan(offset, 4), _key.Length);
            offset += 4;
            _key.CopyTo(buffer.AsSpan(offset));
            offset += _key.Length;

            BitConverter.TryWriteBytes(buffer.AsSpan(offset, 8), _value);
        }
    }
}