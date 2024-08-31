using System;

namespace Pulse
{
    internal readonly struct UnityPulseSessionStart
    {
        private readonly byte _msgType;
        private readonly byte[] _session;
        private readonly byte[] _identifier;
        private readonly byte[] _version;
        private readonly byte[] _platform;
        private readonly byte[] _device;
        
        public UnityPulseSessionStart(byte[] session, byte[] identifier, byte[] version, byte[] platform, byte[] device)
        {
            _msgType = 0x00;
            _session = session;
            _identifier =  identifier;
            _version =  version;
            _platform =  platform;
            _device = device;
        }
        
        public byte[] ToBytes()
        {
            int totalSize = 1 + 4 + _session.Length + 4 + _identifier.Length + 4 + _version.Length + 4 + _platform.Length + 4 + _device.Length;
            Span<byte> buffer = totalSize <= 256 ? stackalloc byte[totalSize] : new byte[totalSize];

            int offset = 0;

            buffer[offset] = _msgType;
            offset += 1;

            BitConverter.TryWriteBytes(buffer.Slice(offset, 4), _session.Length);
            offset += 4;
            _session.CopyTo(buffer.Slice(offset));
            offset += _session.Length;

            BitConverter.TryWriteBytes(buffer.Slice(offset, 4), _identifier.Length);
            offset += 4;
            _identifier.CopyTo(buffer.Slice(offset));
            offset += _identifier.Length;

            BitConverter.TryWriteBytes(buffer.Slice(offset, 4), _version.Length);
            offset += 4;
            _version.CopyTo(buffer.Slice(offset));
            offset += _version.Length;

            BitConverter.TryWriteBytes(buffer.Slice(offset, 4), _platform.Length);
            offset += 4;
            _platform.CopyTo(buffer.Slice(offset));
            offset += _platform.Length;

            BitConverter.TryWriteBytes(buffer.Slice(offset, 4), _device.Length);
            offset += 4;
            _device.CopyTo(buffer.Slice(offset));

            return buffer.ToArray();
        }
    }

    internal readonly struct UnityPulseSessionStop
    {
        private readonly byte _msgType;
        private readonly byte[] _session;
        
        public UnityPulseSessionStop(byte[] session)
        {
            _msgType = 0x02;
            _session = session;
        }
        
        public byte[] ToBytes()
        {
            var totalSize = 1 + 4 + _session.Length;
            Span<byte> buffer = totalSize <= 256 ? stackalloc byte[totalSize] : new byte[totalSize];

            var offset = 0;
            buffer[offset] = _msgType;
            offset += 1;
        
            BitConverter.TryWriteBytes(buffer.Slice(offset, 4), _session.Length);
            offset += 4;

            _session.CopyTo(buffer.Slice(offset));

            return buffer.ToArray();
        }
    }
}