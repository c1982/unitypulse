package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

type PulseController struct {
	repository *Repository
	router     *gin.Engine
}

func NewPulseController(repository *Repository, router *gin.Engine) *PulseController {
	return &PulseController{
		repository: repository,
		router:     router,
	}
}

func (p *PulseController) SessionHandler(c *gin.Context) {
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "10")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
		return
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid limit number"})
		return
	}

	offset := (page - 1) * limit
	totalSessionCount, _ := p.repository.TotalSessionCount()

	sessions, err := p.repository.GetSessions(offset, limit)
	if err != nil {
		log.Error().Err(err).Msg("Failed to get sessions")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get sessions"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"page":        page,
		"total_pages": totalSessionCount / int64(limit),
		"limit":       limit,
		"total_count": totalSessionCount,
		"sessions":    sessions,
	})
}

func (p *PulseController) DataListHandler(c *gin.Context) {
	sessionID := c.Query("session_id")

	if sessionID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "session_id is required"})
		return
	}

	dataList, err := p.repository.GetDataList(sessionID)
	if err != nil {
		log.Error().Err(err).Msg("Failed to get data list")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get data list"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"session_id": sessionID,
		"data":       dataList,
	})
}
