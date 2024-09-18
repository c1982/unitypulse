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
