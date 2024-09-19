package main

import (
	"flag"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {
	udpaddr := flag.String("udpaddr", ":7771", "UDP server address")
	webaddr := flag.String("webaddr", ":8080", "Web server address")
	dbhost := flag.String("dbhost", "postgres", "Database host")
	dbuser := flag.String("dbuser", "pulse", "Database user")
	dbpass := flag.String("dbpass", "p@ssw0rd", "Database password")
	dbname := flag.String("dbname", "pulsedb", "Database name")
	dbport := flag.String("dbport", "5432", "Database port")
	flag.Parse()

	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	zerolog.SetGlobalLevel(zerolog.DebugLevel)

	repo, err := NewRepositoryWithPostgreSQL(*dbhost, *dbuser, *dbpass, *dbname, *dbport)
	if err != nil {
		log.Fatal().Err(err).Msg("Error creating repository")
	}

	udpsrv := NewPulseUDPServer(*udpaddr, repo)
	websrv := NewPulseWebServer(*webaddr, repo)

	go udpsrv.Start()
	go websrv.Start()

	select {}
}
