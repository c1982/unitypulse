import api from '../api/api';
import { Session } from '../types/session';

export const getSessions = async (page: number, limit: number): Promise<Session | null> => {
    const response = await api.get(`sessions?page=${page}&limit=${limit}`);
    return response.data;
};
