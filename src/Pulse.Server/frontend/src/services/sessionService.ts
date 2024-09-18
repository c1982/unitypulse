import api from '../api/api';
import { Session, SessionDetail } from '../types/session';

export const getSessions = async (page: number, limit: number): Promise<Session | null> => {
    const response = await api.get(`sessions?page=${page}&limit=${limit}`);
    return response.data;
};

export const getSessionDetailByID = async (sessionID: string): Promise<SessionDetail | null> => {
    const response = await api.get(`data?session_id=${sessionID}`);
    return response.data;
};
