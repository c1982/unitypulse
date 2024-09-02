package main

import (
	"fmt"
	"time"

	"Pulse.Server/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository() (*Repository, error) {
	db, err := gorm.Open(sqlite.Open("pulse.db"), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	err = db.AutoMigrate(&models.Sessions{}, &models.Datas{}, &models.CustomDatas{})
	if err != nil {
		return nil, err
	}

	return &Repository{
		db: db,
	}, nil
}

func (r *Repository) StartSession(data *models.PulseSessionStart) error {
	var session = &models.Sessions{
		Session:    string(data.Session),
		Identifier: string(data.Identifier),
		Version:    string(data.Version),
		Platform:   string(data.Platform),
		Device:     string(data.Device),
		StartTime:  time.Now(),
	}

	return r.db.Create(session).Error
}

func (r *Repository) StopSession(data *models.PulseSessionStop) error {
	var sessionID = string(data.Session)
	return r.db.Model(&models.Sessions{}).Where("session = ?", sessionID).Update("StopTime", time.Now()).Error
}

func (r *Repository) InsertData(data *models.PulseData) error {
	if len(data.CollectedData) != 23 {
		return fmt.Errorf("collected data has wrong length: %d", len(data.CollectedData))
	}

	var datas = &models.Datas{
		Session:                        string(data.Session),
		SystemUsedMemory:               data.CollectedData[0],
		TotalUsedMemory:                data.CollectedData[1],
		GCUsedMemory:                   data.CollectedData[2],
		AudioUsedMemory:                data.CollectedData[3],
		VideoUsedMemory:                data.CollectedData[4],
		ProfilerUsedMemory:             data.CollectedData[5],
		SetPassCallsCount:              data.CollectedData[6],
		DrawCallsCount:                 data.CollectedData[7],
		TotalBatchesCount:              data.CollectedData[8],
		TrianglesCount:                 data.CollectedData[9],
		VerticesCount:                  data.CollectedData[10],
		RenderTexturesCount:            data.CollectedData[11],
		RenderTexturesBytes:            data.CollectedData[12],
		RenderTexturesChangesCount:     data.CollectedData[13],
		UsedBuffersCount:               data.CollectedData[14],
		UsedBuffersBytes:               data.CollectedData[15],
		UsedShadersCount:               data.CollectedData[16],
		VertexBufferUploadInFrameCount: data.CollectedData[17],
		VertexBufferUploadInFrameBytes: data.CollectedData[18],
		IndexBufferUploadInFrameCount:  data.CollectedData[19],
		IndexBufferUploadInFrameBytes:  data.CollectedData[20],
		ShadowCastersCount:             data.CollectedData[21],
		Fps:                            data.CollectedData[22],
	}

	return r.db.Create(datas).Error
}

func (r *Repository) InsertCustomData(session *models.UnityPulseCustomData) error {
	var customData = &models.CustomDatas{
		Session: string(session.Session),
		Key:     string(session.Key),
		Value:   session.Value,
		Time:    time.Now(),
	}

	return r.db.Create(customData).Error
}

func (r *Repository) GetSessions() ([]models.Sessions, error) {
	var sessions []models.Sessions
	err := r.db.Find(&sessions).Error
	return sessions, err
}
