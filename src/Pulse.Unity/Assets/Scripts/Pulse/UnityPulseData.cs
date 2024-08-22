using System.IO;
using System.Text;

namespace Pulse
{
    public readonly struct UnityPulseData
    {
        private readonly string _session;
        private readonly long[] _collectedData;
        private readonly string _identifier;
        private readonly string _version;
        private readonly string _platform;
        private readonly string _device;
        
        public UnityPulseData(string session, string identifier, string version, string platform, string device, long[] data)
        {
            _session = session;
            _identifier = identifier;
            _version = version;
            _platform = platform;
            _device = device;
            _collectedData = data;
        }
        
        public byte[] ToBytes()
        {
            using var memoryStream = new MemoryStream();
            using (var writer = new BinaryWriter(memoryStream))
            {
                WriteString(writer, _session);
                WriteString(writer, _identifier);
                WriteString(writer, _version);
                WriteString(writer, _platform);
                WriteString(writer, _device);
                WriteLongArray(writer, _collectedData);
            }
            return memoryStream.ToArray();
        }

        private void WriteString(BinaryWriter writer, string value)
        {
            if (value == null)
            {
                writer.Write(0);
            }
            else
            {
                var stringBytes = Encoding.UTF8.GetBytes(value);
                writer.Write(stringBytes.Length);
                writer.Write(stringBytes);
            }
        }

        private void WriteLongArray(BinaryWriter writer, long[] array)
        {
            if (array == null)
            {
                writer.Write(0);
            }
            else
            {
                writer.Write(array.Length);
                foreach (var value in array)
                {
                    writer.Write(value);
                }
            }
        }
    }
}