package main

import (
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

type PulseWebServer struct {
	addr        string
	router      *gin.Engine
	routerGroup *gin.RouterGroup
	repository  *Repository
	controller  *PulseController
}

func NewPulseWebServer(addr string, repositoy *Repository) *PulseWebServer {
	router := gin.Default()
	gin.DisableConsoleColor()
	apiV1 := router.Group("/api/v1")

	controller := NewPulseController(repositoy, router)
	return &PulseWebServer{
		router:      router,
		routerGroup: apiV1,
		addr:        addr,
		repository:  repositoy,
		controller:  controller,
	}
}

func (p *PulseWebServer) RegisterRoutes() {
	p.routerGroup.GET("/sessions", p.controller.SessionHandler)
}

func (p *PulseWebServer) Start() error {
	log.Info().Str("service", "web").Msgf("Web server Listening on %s", p.addr)
	p.RegisterRoutes()
	return p.router.Run(p.addr)
}
