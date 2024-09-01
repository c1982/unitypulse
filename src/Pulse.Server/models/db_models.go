package models

import (
	"time"

	"gorm.io/gorm"
)

type Sessions struct {
	gorm.Model
	ID         uint
	Session    string `gorm:"index"`
	Identifier string
	Version    string
	Platform   string
	Device     string
	StartTime  time.Time
	StopTime   time.Time
}

type Datas struct {
	gorm.Model
	Session                        string `gorm:"index"`
	SystemUsedMemory               int64
	TotalUsedMemory                int64
	GCUsedMemory                   int64
	AudioUsedMemory                int64
	VideoUsedMemory                int64
	ProfilerUsedMemory             int64
	SetPassCallsCount              int64
	DrawCallsCount                 int64
	TotalBatchesCount              int64
	TrianglesCount                 int64
	VerticesCount                  int64
	RenderTexturesCount            int64
	RenderTexturesBytes            int64
	RenderTexturesChangesCount     int64
	UsedBuffersCount               int64
	UsedBuffersBytes               int64
	UsedShadersCount               int64
	VertexBufferUploadInFrameCount int64
	VertexBufferUploadInFrameBytes int64
	IndexBufferUploadInFrameCount  int64
	IndexBufferUploadInFrameBytes  int64
	ShadowCastersCount             int64
	Fps                            int64
}

type CustomDatas struct {
	gorm.Model
	Session string `gorm:"index"`
	Key     string
	Value   int64
	Time    int64
}
