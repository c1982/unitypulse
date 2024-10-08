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

	// * CORS
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})
	
	router.Static("/static", "./frontend/build/static")

	router.NoRoute(func(c *gin.Context) {
		c.File("./frontend/build/index.html")
	})
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
	p.routerGroup.GET("/data", p.controller.DataListHandler)
	p.routerGroup.GET("/sessionsByFilters", p.controller.SessionFilterHandler)
}

func (p *PulseWebServer) Start() error {
	log.Info().Str("service", "web").Msgf("Web server Listening on %s", p.addr)
	p.RegisterRoutes()
	return p.router.Run(p.addr)
}
