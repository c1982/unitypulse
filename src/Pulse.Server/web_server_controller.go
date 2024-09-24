package main

import (
	"net/http"
	"strconv"

	"Pulse.Server/models"
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
	page, limit, offset, err := parsePaginationParams(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page or limit"})
		return
	}
	totalSessionCount, _ := p.repository.TotalSessionCount()

	sessions, err := p.repository.GetSessions(offset, limit)
	if err != nil {
		log.Error().Err(err).Msg("Failed to get sessions")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get sessions"})
		return
	}

	handleSessionsResponse(c, page, limit, offset, totalSessionCount, sessions)
}

func (p *PulseController) SessionFilterHandler(c *gin.Context) {
	page, limit, offset, err := parsePaginationParams(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page or limit"})
		return
	}

	platform := c.Query("platform")
	version := c.Query("version")
	device := c.Query("device")
	sessionIDs := c.QueryArray("session_id")

	totalSessionCount, _ := p.repository.TotalSessionCount()

	sessions, err := p.repository.GetSessionsWithFilters(offset, limit, platform, version, sessionIDs, device)
	if err != nil {
		log.Error().Err(err).Msg("Failed to get sessions")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get sessions"})
		return
	}

	handleSessionsResponse(c, page, limit, offset, totalSessionCount, sessions)
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

func parsePaginationParams(c *gin.Context) (page int, limit int, offset int, err error) {
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "10")

	page, err = strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		return 0, 0, 0, err
	}

	limit, err = strconv.Atoi(limitStr)
	if err != nil || limit < 1 {
		return 0, 0, 0, err
	}

	offset = (page - 1) * limit
	return page, limit, offset, nil
}

func handleSessionsResponse(c *gin.Context, page int, limit int, offset int, totalSessionCount int64, sessions []models.Sessions) {
	c.JSON(http.StatusOK, gin.H{
		"page":        page,
		"total_pages": totalSessionCount / int64(limit),
		"limit":       limit,
		"total_count": totalSessionCount,
		"sessions":    sessions,
	})
}