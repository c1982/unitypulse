using System;
using System.Net.Sockets;
using System.Threading.Tasks;

namespace Pulse.Transports
{
    internal class UdpTransporter :IDisposable
    {
        private readonly UdpClient _udpClient;

        public UdpTransporter(string host, int port)
        {
            _udpClient = new UdpClient(host, port);
            _udpClient.Client.SendBufferSize = 1200; 
            _udpClient.Client.ReceiveBufferSize = 1200;
            _udpClient.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
            
            _udpClient.Connect(host, port);
        }
        
        public async Task SendDataAsync(byte[] data)
        { 
            _ = await _udpClient.SendAsync(data, data.Length);
        }

        public void Dispose()
        {
            _udpClient?.Close();
            _udpClient?.Dispose();
        }
    }
}