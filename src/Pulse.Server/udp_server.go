package main

import (
	"github.com/rs/zerolog/log"
	"net"
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

	log.Info().Str("service", "udp").Msgf("UDP server Listening on %s", port)
	p.handleUDPConnection(conn)

	log.Info().Str("service", "udp").Msgf("UDP server stop listening")
}

func (p *PulseUDPServer) handleUDPConnection(conn *net.UDPConn) {

	for {
		buffer := make([]byte, maxBufferSize)
		n, _, err := conn.ReadFromUDP(buffer)
		if err != nil {
			continue
		}

		go func(data []byte) {
			msgType := data[0]
			log.Info().Str("service", "udp").Msgf("Received message type: %d", msgType)
			switch msgType {
			case 0:
				p.getPulseSessionStart(data)
				break
			case 1:
				p.getPulseData(data)
				break
			case 2:
				p.getPulseSessionStop(data)
				break
			case 3:
				p.getPulseCustomData(data)
				break
			default:
				log.Warn().Str("service", "udp").Msgf("unknown message type: %d", msgType)
			}
		}(buffer[:n])
	}
}

func (p *PulseUDPServer) getPulseSessionStart(data []byte) {
	s, err := ParsePulseSessionStart(data)
	if err != nil {
		log.Err(err).Msgf("parsing error session start: %v", err)
		return
	}

	err = p.repository.StartSession(s)
	if err != nil {
		log.Err(err).Str("service", "udp").Msgf("error saving session start: %v", err)
		return
	}

	log.Info().Str("service", "udp").Msgf("session start: %s %s %s %s %s",
		string(s.Session), string(s.Identifier), string(s.Version), string(s.Platform), string(s.Device))
}

func (p *PulseUDPServer) getPulseData(data []byte) {
	pulseData, err := ParsePulseData(data)
	if err != nil {
		log.Err(err).Str("service", "udp").Msgf("parsing error pulse data: %v", err)
		return
	}

	err = p.repository.InsertData(pulseData)
	if err != nil {
		log.Err(err).Str("service", "udp").Msgf("error saving pulse data: %v", err)
		return
	}
}

func (p *PulseUDPServer) getPulseSessionStop(data []byte) {
	s, err := ParsePulseSessionStop(data)
	if err != nil {
		log.Err(err).Str("service", "udp").Msgf("parsing error session stop: %v", err)
		return
	}

	err = p.repository.StopSession(s)
	if err != nil {
		log.Err(err).Str("service", "udp").Msgf("error saving session stop: %v", err)
		return
	}

	log.Info().Str("service", "udp").Msgf("session stop: %s", string(s.Session))
}

func (p *PulseUDPServer) getPulseCustomData(data []byte) {
	customData, err := ParsePulseCustomData(data)
	if err != nil {
		log.Err(err).Str("service", "udp").Msgf("parsing error custom data: %v", err)
		return
	}

	err = p.repository.InsertCustomData(customData)
	if err != nil {
		log.Err(err).Str("service", "udp").Msgf("error saving custom data: %v", err)
		return
	}
}
