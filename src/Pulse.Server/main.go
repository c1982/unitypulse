package main

import (
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	zerolog.SetGlobalLevel(zerolog.DebugLevel)

	repo, err := NewRepository()
	if err != nil {
		log.Fatal().Err(err).Msg("Error creating repository")
	}

	udpsrv := NewPulseUDPServer(":7771", repo)
	websrv := NewPulseWebServer(":8080", repo)

	go udpsrv.Start()
	go websrv.Start()

	select {}
}
