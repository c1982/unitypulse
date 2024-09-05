package models

import (
	"gorm.io/gorm"
)

type Sessions struct {
	gorm.Model `json:"-"`
	Session    string `json:"session", gorm:"index"`
	Identifier string `json:"identifier"`
	Version    string `json:"version"`
	Platform   string `json:"platform"`
	Device     string `json:"device"`
	StartTime  int64  `json:"start_time"`
	StopTime   int64  `json:"stop_time"`
}

type Datas struct {
	gorm.Model                     `json:"-"`
	Session                        string `json:"-", gorm:"index"`
	Timestamp                      int64  `json:"timestamp"`
	SystemUsedMemory               int64  `json:"system_used_memory"`
	TotalUsedMemory                int64  `json:"total_used_memory"`
	GCUsedMemory                   int64  `json:"gc_used_memory"`
	AudioUsedMemory                int64  `json:"audio_used_memory"`
	VideoUsedMemory                int64  `json:"video_used_memory"`
	ProfilerUsedMemory             int64  `json:"profiler_used_memory"`
	SetPassCallsCount              int64  `json:"set_pass_calls_count"`
	DrawCallsCount                 int64  `json:"draw_calls_count"`
	TotalBatchesCount              int64  `json:"total_batches_count"`
	TrianglesCount                 int64  `json:"triangles_count"`
	VerticesCount                  int64  `json:"vertices_count"`
	RenderTexturesCount            int64  `json:"render_textures_count"`
	RenderTexturesBytes            int64  `json:"render_textures_bytes"`
	RenderTexturesChangesCount     int64  `json:"render_textures_changes_count"`
	UsedBuffersCount               int64  `json:"used_buffers_count"`
	UsedBuffersBytes               int64  `json:"used_buffers_bytes"`
	UsedShadersCount               int64  `json:"used_shaders_count"`
	VertexBufferUploadInFrameCount int64  `json:"vertex_buffer_upload_in_frame_count"`
	VertexBufferUploadInFrameBytes int64  `json:"vertex_buffer_upload_in_frame_bytes"`
	IndexBufferUploadInFrameCount  int64  `json:"index_buffer_upload_in_frame_count"`
	IndexBufferUploadInFrameBytes  int64  `json:"index_buffer_upload_in_frame_bytes"`
	ShadowCastersCount             int64  `json:"shadow_casters_count"`
	Fps                            int64  `json:"fps"`
}

type CustomDatas struct {
	gorm.Model `json:"-"`
	Session    string `json:"session", gorm:"index"`
	Key        string `json:"key"`
	Value      int64  `json:"value"`
	Timestamp  int64  `json:"time"`
}
