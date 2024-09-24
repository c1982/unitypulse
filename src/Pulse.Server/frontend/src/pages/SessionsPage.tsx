import { useEffect, useState } from 'react';
import { getSessions } from '../services/sessionService';
import { Session } from '../types/session';
import { DefaultTable } from '../components/Tables/DefaultTable/DefaultTable';
import { SessionTableRow } from '../components/Cards/SessionTableRow';
import { Select } from '../components/Select/Select';
import { HeadingSecondary } from '../components/Typography/HeadingSecondary';

type ComparisonSessions = {
    first_session_id: string | null;
    second_session_id: string | null;
};

export const SessionsPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sessions, setSessions] = useState<Session | null>(null);
    const [filteredSessions, setFilteredSessions] = useState<Session | null>(sessions);
    const [compareSessions, setCompareSessions] = useState<ComparisonSessions>({
        first_session_id: null,
        second_session_id: null,
    });

    useEffect(() => {
        const fetchSessions = async () => {
            const sessionsData = await getSessions(page, pageSize);
            setSessions(sessionsData);
            setFilteredSessions(sessionsData);
        };

        fetchSessions();
    }, [page, pageSize]);

    useEffect(() => {
        const { first_session_id, second_session_id } = compareSessions;

        if (!sessions || !first_session_id || !second_session_id) {
            setFilteredSessions(sessions);
            return;
        }

        const { sessions: sessionList, limit, page, total_count, total_pages } = sessions;

        const firstSession = sessionList.find((session) => session.session === first_session_id);
        const secondSession = sessionList.find((session) => session.session === second_session_id);

        if (firstSession && secondSession && firstSession !== secondSession) {
            setFilteredSessions({
                sessions: [firstSession, secondSession],
                limit,
                page,
                total_count,
                total_pages,
            });
        }
    }, [compareSessions, sessions]);

    if (!filteredSessions?.sessions || !sessions?.sessions) {
        return <div />;
    }

    return (
        <div>
            <HeadingSecondary>
                Compare two sessions by selecting them from the dropdowns below
            </HeadingSecondary>

            <div className='flex my-8'>
                <div className='flex-1 flex gap-3'>
                    <Select
                        selectLabel='1.Session'
                        selectOptions={sessions?.sessions.map((session) => session.session)}
                        selectValue={compareSessions?.first_session_id || ''}
                        selectOnChange={(e) =>
                            setCompareSessions({
                                ...compareSessions,
                                first_session_id: e.toString(),
                            })
                        }
                    />

                    <Select
                        selectLabel='2.Session'
                        selectOptions={sessions?.sessions.map((session) => session.session)}
                        selectValue={compareSessions?.second_session_id || ''}
                        selectOnChange={(e) =>
                            setCompareSessions({
                                ...compareSessions,
                                second_session_id: e.toString(),
                            })
                        }
                    />
                </div>
            </div>

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
                {filteredSessions.sessions?.map((session) => {
                    return <SessionTableRow key={session.session} session={session} />;
                })}
            </DefaultTable>

            <div className='flex justify-end'>
                <Select
                    selectLabel='Page Size'
                    selectOptions={[10, 25, 50, 100]}
                    selectValue={pageSize}
                    selectOnChange={(e) => setPageSize(Number(e))}
                />
            </div>
        </div>
    );
};
