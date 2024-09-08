package main

import (
	"flag"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {
	dbhost := flag.String("dbhost", "localhost", "Database host")
	dbuser := flag.String("dbuser", "pulse", "Database user")
	dbpass := flag.String("dbpass", "p@ssw0rd", "Database password")
	dbname := flag.String("dbname", "pulse", "Database name")
	dbport := flag.String("dbport", "5432", "Database port")

	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	zerolog.SetGlobalLevel(zerolog.DebugLevel)

	repo, err := NewRepositoryWithPostgreSQL(*dbhost, *dbuser, *dbpass, *dbname, *dbport)
	if err != nil {
		log.Fatal().Err(err).Msg("Error creating repository")
	}

	udpsrv := NewPulseUDPServer(":7771", repo)
	websrv := NewPulseWebServer(":8080", repo)

	go udpsrv.Start()
	go websrv.Start()

	select {}
}
