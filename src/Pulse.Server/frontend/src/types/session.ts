export interface SessionData {
    session: string;
    identifier: string;
    version: string;
    platform: string;
    device: string;
    start_time: number;
    stop_time: number;
}

export interface Session {
    limit: number;
    page: number;
    sessions: SessionData[];
    total_count: number;
    total_pages: number;
}

export interface SessionDetail {
    session: string;
    timestamp: number;
    system_used_memory: number;
    total_used_memory: number;
    gc_used_memory: number;
    audio_used_memory: number;
    video_used_memory: number;
    profiler_used_memory: number;
    set_pass_calls_count: number;
    draw_calls_count: number;
    total_batches_count: number;
    triangles_count: number;
    vertices_count: number;
    render_textures_count: number;
    render_textures_bytes: number;
    render_textures_changes_count: number;
    used_buffers_count: number;
    used_buffers_bytes: number;
    used_shaders_count: number;
    vertex_buffer_upload_in_frame_count: number;
    vertex_buffer_upload_in_frame_bytes: number;
    index_buffer_upload_in_frame_count: number;
    index_buffer_upload_in_frame_bytes: number;
    shadow_casters_count: number;
    fps: number;
}
