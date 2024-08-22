package main

import (
	"bytes"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"sync"
)

const (
	maxBufferSize = 1024
	port          = ":7771"
)

type UnityPulseData struct {
	Session       string  `json:"session"`
	Identifier    string  `json:"identifier"`
	Version       string  `json:"version"`
	Platform      string  `json:"platform"`
	Device        string  `json:"device"`
	CollectedData []int64 `json:"collectedData"`
}

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
			d := GetUnityPulse(data)
			log.Printf("Received %d bytes from %s", n, addr)
			log.Printf("Data: %s", d)
		}(buffer[:n], addr)
	}
}

func GetUnityPulse(data []byte) string {
	reader := bytes.NewReader(data)

	upd := UnityPulseData{}

	upd.Session = readString(reader)
	upd.Identifier = readString(reader)
	upd.Version = readString(reader)
	upd.Platform = readString(reader)
	upd.Device = readString(reader)
	upd.CollectedData = readLongArray(reader)

	jsonData, err := json.MarshalIndent(upd, "", "  ")
	if err != nil {
		log.Fatalf("JSON marshalling failed: %s", err)
	}
	return string(jsonData)
}

func readString(reader io.Reader) string {
	var length int32
	if err := binary.Read(reader, binary.LittleEndian, &length); err != nil {
		log.Fatalf("Failed to read string length: %s", err)
	}

	if length == 0 {
		return ""
	}

	stringBytes := make([]byte, length)
	if err := binary.Read(reader, binary.LittleEndian, &stringBytes); err != nil {
		log.Fatalf("Failed to read string: %s", err)
	}

	return string(stringBytes)
}

func readLongArray(reader io.Reader) []int64 {
	var length int32
	if err := binary.Read(reader, binary.LittleEndian, &length); err != nil {
		log.Fatalf("Failed to read long array length: %s", err)
	}

	if length == 0 {
		return []int64{}
	}

	longArray := make([]int64, length)
	if err := binary.Read(reader, binary.LittleEndian, &longArray); err != nil {
		log.Fatalf("Failed to read long array: %s", err)
	}

	return longArray
}
