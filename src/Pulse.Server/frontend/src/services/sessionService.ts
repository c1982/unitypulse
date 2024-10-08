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

export const getSessionsWithFilters = async (
    page: number,
    limit: number,
    filters: { [key: string]: any },
): Promise<Session | null> => {
    let filtersString = '';

    for (const key in filters) {
        if (filters[key].length === 0) {
            continue;
        }

        if (key === 'session_id') {
            filtersString += `${key}=${filters[key].join(`&${key}=`)}&`;
        } else {
            filtersString += `${key}=${filters[key]}&`;
        }
    }

    const response = await api.get(
        `sessionsByFilters?page=${page}&limit=${limit}&${filtersString}`,
    );
    return response.data;
};
