using NUnit.Framework;
using System;
using Pulse.Unity;

namespace Pulse.Tests.Runtime
{
    public class UnityPulsePackageTests
    {
        [Test]
        public void UnityPulseData_Write_ShouldWriteCorrectDataToBuffer()
        {
            // Arrange
            byte[] session = { 0x01, 0x02, 0x03, 0x04 };
            long[] data = { 123456789L, 987654321L };
            UnityPulseData pulseData = new UnityPulseData(session, data);

            byte[] buffer = new byte[1024];

            // Act
            pulseData.Write(ref buffer);

            // Assert
            int offset = 0;

            // Check message type
            Assert.AreEqual(0x01, buffer[offset]);
            offset += 1;

            // Check session length
            int sessionLength = BitConverter.ToInt32(buffer, offset);
            Assert.AreEqual(session.Length, sessionLength);
            offset += 4;

            // Check session data
            for (int i = 0; i < session.Length; i++)
            {
                Assert.AreEqual(session[i], buffer[offset + i]);
            }
            offset += session.Length;

            // Check collected data length
            int dataLength = BitConverter.ToInt32(buffer, offset);
            Assert.AreEqual(data.Length, dataLength);
            offset += 4;

            // Check collected data
            for (int i = 0; i < data.Length; i++)
            {
                long value = BitConverter.ToInt64(buffer, offset);
                Assert.AreEqual(data[i], value);
                offset += 8;
            }
        }
        
        [Test]
        public void UnityPulseCustomData_Write_ShouldWriteCorrectDataToBuffer()
        {
            // Arrange
            byte[] session = { 0x01, 0x02, 0x03, 0x04 };
            byte[] key = { 0x0A, 0x0B };
            long value = 123456789L;
            UnityPulseCustomData customData = new UnityPulseCustomData(session, key, value);

            byte[] buffer = new byte[1024];

            // Act
            customData.Write(ref buffer);

            // Assert
            int offset = 0;

            // Check message type
            Assert.AreEqual(0x03, buffer[offset]);
            offset += 1;

            // Check session length
            int sessionLength = BitConverter.ToInt32(buffer, offset);
            Assert.AreEqual(session.Length, sessionLength);
            offset += 4;

            // Check session data
            for (int i = 0; i < session.Length; i++)
            {
                Assert.AreEqual(session[i], buffer[offset + i]);
            }
            offset += session.Length;

            // Check key length
            int keyLength = BitConverter.ToInt32(buffer, offset);
            Assert.AreEqual(key.Length, keyLength);
            offset += 4;

            // Check key data
            for (int i = 0; i < key.Length; i++)
            {
                Assert.AreEqual(key[i], buffer[offset + i]);
            }
            offset += key.Length;

            // Check value
            long writtenValue = BitConverter.ToInt64(buffer, offset);
            Assert.AreEqual(value, writtenValue);
        }
        
        [Test]
        public void UnityPulseSessionStart_Write_ShouldWriteCorrectDataToBuffer()
        {
            byte[] session = { 0x01, 0x02, 0x03, 0x04 };
            byte[] identifier = { 0x05, 0x06, 0x07, 0x08 };
            byte[] version = { 0x09, 0x0A, 0x0B };
            byte[] platform = { 0x0C, 0x0D };
            byte[] device = { 0x0E, 0x0F };

            UnityPulseSessionStart pulseSessionStart = new UnityPulseSessionStart(session, identifier, version, platform, device);
            byte[] buffer = new byte[1024];

            pulseSessionStart.Write(ref buffer);

            int offset = 0;

            // Check message type
            Assert.AreEqual(0x00, buffer[offset]);
            offset += 1;

            // Check session length
            int sessionLength = BitConverter.ToInt32(buffer, offset);
            Assert.AreEqual(session.Length, sessionLength);
            offset += 4;

            // Check session data
            for (int i = 0; i < session.Length; i++)
            {
                Assert.AreEqual(session[i], buffer[offset + i]);
            }
            offset += session.Length;

            // Check identifier length
            int identifierLength = BitConverter.ToInt32(buffer, offset);
            Assert.AreEqual(identifier.Length, identifierLength);
            offset += 4;

            // Check identifier data
            for (int i = 0; i < identifier.Length; i++)
            {
                Assert.AreEqual(identifier[i], buffer[offset + i]);
            }
            offset += identifier.Length;

            // Check version length
            int versionLength = BitConverter.ToInt32(buffer, offset);
            Assert.AreEqual(version.Length, versionLength);
            offset += 4;

            // Check version data
            for (int i = 0; i < version.Length; i++)
            {
                Assert.AreEqual(version[i], buffer[offset + i]);
            }
            offset += version.Length;

            // Check platform length
            int platformLength = BitConverter.ToInt32(buffer, offset);
            Assert.AreEqual(platform.Length, platformLength);
            offset += 4;

            // Check platform data
            for (int i = 0; i < platform.Length; i++)
            {
                Assert.AreEqual(platform[i], buffer[offset + i]);
            }
            offset += platform.Length;

            // Check device length
            int deviceLength = BitConverter.ToInt32(buffer, offset);
            Assert.AreEqual(device.Length, deviceLength);
            offset += 4;

            // Check device data
            for (int i = 0; i < device.Length; i++)
            {
                Assert.AreEqual(device[i], buffer[offset + i]);
            }
        }
        
        [Test]
        public void UnityPulseSessionStop_Write_ShouldWriteCorrectDataToBuffer()
        {
            byte[] session = { 0x01, 0x02, 0x03, 0x04 };
            UnityPulseSessionStop pulseSessionStop = new UnityPulseSessionStop(session);
            byte[] buffer = new byte[1024];

            pulseSessionStop.Write(ref buffer);

            int offset = 0;

            Assert.AreEqual(0x02, buffer[offset]);
            offset += 1;

            int sessionLength = BitConverter.ToInt32(buffer, offset);
            Assert.AreEqual(session.Length, sessionLength);
            offset += 4;

            for (int i = 0; i < session.Length; i++)
            {
                Assert.AreEqual(session[i], buffer[offset + i]);
            }
        }
    }
}