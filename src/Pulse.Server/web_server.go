package main

import (
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
	"net/http"
)

type PulseWebServer struct {
	addr        string
	router      *gin.Engine
	routerGroup *gin.RouterGroup
	repository  *Repository
}

func NewPulseWebServer(addr string, repositoy *Repository) *PulseWebServer {
	router := gin.Default()
	gin.DisableConsoleColor()
	apiV1 := router.Group("/v1")

	return &PulseWebServer{
		router:      router,
		routerGroup: apiV1,
		addr:        addr,
		repository:  repositoy,
	}
}

func (p *PulseWebServer) RegisterRoutes() {
	p.routerGroup.POST("/session", p.SessionHandler)
}

func (p *PulseWebServer) SessionHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func (p *PulseWebServer) Start() error {
	log.Info().Str("service", "web").Msgf("Web server Listening on %s", p.addr)
	p.RegisterRoutes()
	return p.router.Run(p.addr)
}
