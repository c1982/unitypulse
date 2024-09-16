using System;
using System.Net.Sockets;

namespace Pulse.Unity.Transports
{
    internal class UdpTransport : IDisposable
    {
        private readonly UdpClient _udpClient;
        public UdpTransport(string host, int port, int sendBufferSize, int receiveBufferSize)
        {
            _udpClient = new UdpClient(host, port);
            _udpClient.Client.SendBufferSize = sendBufferSize; 
            _udpClient.Client.ReceiveBufferSize = receiveBufferSize;
            _udpClient.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
            _udpClient.DontFragment = true;
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