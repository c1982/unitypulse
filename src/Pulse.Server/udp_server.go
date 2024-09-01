package main

import (
	"github.com/rs/zerolog/log"
	"net"
	"sync"
)

const (
	maxBufferSize = 1024
	port          = ":7771"
)

type PulseUDPServer struct {
	maxBufferSize int
	addr          string
	repository    *Repository
}

func NewPulseUDPServer(addr string, repository *Repository) *PulseUDPServer {
	return &PulseUDPServer{
		addr:          addr,
		maxBufferSize: maxBufferSize,
		repository:    repository,
	}
}

func (p *PulseUDPServer) Start() {
	addr, err := net.ResolveUDPAddr("udp", port)
	if err != nil {
		log.Fatal().Err(err).Str("service", "udp").Msgf("Error resolving address: %v", err)
	}

	conn, err := net.ListenUDP("udp", addr)
	if err != nil {
		log.Fatal().Err(err).Str("service", "udp").Msgf("Error listening on UDP: %v", err)
	}
	defer conn.Close()

	var wg sync.WaitGroup

	log.Info().Str("service", "udp").Msgf("UDP server Listening on %s", port)
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go p.handleUDPConnection(conn, &wg)
	}

	wg.Wait()
	log.Info().Str("service", "udp").Msgf("UDP server stop listening")
}

func (p *PulseUDPServer) handleUDPConnection(conn *net.UDPConn, wg *sync.WaitGroup) {
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
				p.getPulseSessionStart(data, addr)
				break
			case 1:
				p.getPulseData(data, addr)
				break
			case 2:
				p.getPulseSessionStop(data, addr)
				break
			case 3:
				p.getPulseCustomData(data, addr)
				break
			default:
				log.Warn().Str("service", "udp").Msgf("unknown message type: %d", msgType)
			}
		}(buffer[:n], addr)
	}
}

func (p *PulseUDPServer) getPulseSessionStart(data []byte, addr *net.UDPAddr) {
	s, err := ParsePulseSessionStart(data)
	if err != nil {
		log.Err(err).Msgf("parsing error session start: %v", err)
		return
	}

	log.Info().Str("service", "udp").Msgf("session start: %s", string(s.Session))
}

func (p *PulseUDPServer) getPulseData(data []byte, addr *net.UDPAddr) {
	_, err := ParsePulseData(data)
	if err != nil {
		log.Err(err).Str("service", "udp").Msgf("parsing error pulse data: %v", err)
		return
	}
}

func (p *PulseUDPServer) getPulseSessionStop(data []byte, addr *net.UDPAddr) {
	s, err := ParsePulseSessionStop(data)
	if err != nil {
		log.Err(err).Str("service", "udp").Msgf("parsing error session stop: %v", err)
		return
	}

	log.Info().Str("service", "udp").Msgf("session stop: %s", string(s.Session))
}

func (p *PulseUDPServer) getPulseCustomData(data []byte, addr *net.UDPAddr) {
	_, err := ParsePulseCustomData(data)
	if err != nil {
		log.Err(err).Str("service", "udp").Msgf("parsing error custom data: %v", err)
		return
	}
}
