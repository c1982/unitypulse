using System;
using System.Net.Sockets;
using System.Threading.Tasks;

namespace Pulse.Transports
{
    internal class UdpTransport : IDisposable
    {
        private readonly UdpClient _udpClient;

        public UdpTransport(string host, int port)
        {
            _udpClient = new UdpClient(host, port);
            _udpClient.Client.SendBufferSize = 512; 
            _udpClient.Client.ReceiveBufferSize = 512;
            _udpClient.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
        }
        
        public int SendDataAsync(byte[] data)
        {
            return _udpClient.Send(data, data.Length);
        }

        public void Dispose()
        {
            _udpClient?.Close();
            _udpClient?.Dispose();
        }
    }
}