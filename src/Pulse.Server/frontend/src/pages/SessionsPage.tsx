import { useEffect, useState } from 'react';
import { getSessions } from '../services/sessionService';
import { Session } from '../types/session';
import { DefaultTable } from '../components/Tables/DefaultTable/DefaultTable';
import { SessionTableRow } from '../components/Cards/SessionTableRow';

export const SessionsPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sessions, setSessions] = useState<Session | null>(null);

    useEffect(() => {
        const fetchSessions = async () => {
            const sessionsData = await getSessions(page, pageSize);
            setSessions(sessionsData);
        };

        fetchSessions();
    }, [page, pageSize]);

    if (!sessions?.sessions) {
        return <div />;
    }

    return (
        <DefaultTable
            tableData={sessions?.sessions}
            tableHeaders={[
                'Session',
                'Identifier',
                'Version',
                'Platform',
                'Device',
                'Start Time',
                'Stop Time',
                'Details',
            ]}
            tableTitle='Sessions'
            tableTitleDescription='View all sessions'>
            {sessions.sessions?.map((session) => {
                return <SessionTableRow key={session.session} session={session} />;
            })}
        </DefaultTable>
    );
};
