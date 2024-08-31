using System.IO;
using System.Text;

namespace Pulse
{
    internal static class UnityPulseBytesHelper
    {
        internal static void WriteLongArray(BinaryWriter writer, long[] array)
        {
            writer.Write(array.Length);
            foreach (var value in array)
                writer.Write(value);
        }
        
        internal static void WriteBytes(BinaryWriter writer, byte[] value)
        {
            writer.Write(value.Length);
            writer.Write(value);
        }
        
        internal static void WriteString(BinaryWriter writer, string value)
        {
            var stringBytes = Encoding.UTF8.GetBytes(value);
            writer.Write(stringBytes.Length);
            writer.Write(stringBytes);
        }
    }
}