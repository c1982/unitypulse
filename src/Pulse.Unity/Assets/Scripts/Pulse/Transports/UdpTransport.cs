using System;
using System.Net.Sockets;

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
        
        public int SendData(byte[] data)
        {
            var i= _udpClient.Send(data, data.Length);
            return i;
        }
        
        public async void SendDataAsync(byte[] data)
        {
            await _udpClient.SendAsync(data, data.Length);
        }

        public void Dispose()
        {
            _udpClient?.Close();
            _udpClient?.Dispose();
        }
    }
}