package main

import (
	"fmt"
	"log"
	"net"
	"sync"
)

const (
	maxBufferSize = 1024
	port          = ":7771"
)

func main() {
	addr, err := net.ResolveUDPAddr("udp", port)
	if err != nil {
		log.Fatalf("Error resolving address: %v", err)
	}

	conn, err := net.ListenUDP("udp", addr)
	if err != nil {
		log.Fatalf("Error listening on UDP: %v", err)
	}
	defer conn.Close()

	var wg sync.WaitGroup

	for i := 0; i < 10; i++ {
		wg.Add(1)
		go handleUDPConnection(conn, &wg)
	}

	fmt.Println("UDP server is listening on port", port)
	wg.Wait()
}

func handleUDPConnection(conn *net.UDPConn, wg *sync.WaitGroup) {
	defer wg.Done()
	buffer := make([]byte, maxBufferSize)

	for {
		n, addr, err := conn.ReadFromUDP(buffer)
		if err != nil {
			continue
		}

		go func(data []byte, addr *net.UDPAddr) {
			msgType := data[0]
			switch msgType {
			case 0:
				getPulseSessionStart(data, addr)
				break
			case 1:
				getPulseData(data, addr)
				break
			case 2:
				getPulseSessionStop(data, addr)
				break
			case 3:
				getPulseCustomData(data, addr)
				break
			default:
				fmt.Println("unknown message type:", msgType)
			}
		}(buffer[:n], addr)
	}
}

func getPulseSessionStart(data []byte, addr *net.UDPAddr) {
	s, err := ParsePulseSessionStart(data)
	if err != nil {
		fmt.Println("session start error:", err)
		return
	}

	fmt.Println("session start:", string(s.Session))
}

func getPulseData(data []byte, addr *net.UDPAddr) {
	_, err := ParsePulseData(data)
	if err != nil {
		fmt.Println("pulse data error:", err)
		return
	}
}

func getPulseSessionStop(data []byte, addr *net.UDPAddr) {
	s, err := ParsePulseSessionStop(data)
	if err != nil {
		fmt.Println("session stop error:", err)
		return
	}

	fmt.Println("session stop:", string(s.Session))
}

func getPulseCustomData(data []byte, addr *net.UDPAddr) {
	t, err := ParsePulseCustomData(data)
	if err != nil {
		fmt.Println("custom data error:", err)
		return
	}

	fmt.Println("custom data:", string(t.Key), t.Value)
}
