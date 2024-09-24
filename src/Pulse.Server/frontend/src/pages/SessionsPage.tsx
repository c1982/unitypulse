import { useEffect, useState } from 'react';
import { getSessions, getSessionsWithFilters } from '../services/sessionService';
import { Session } from '../types/session';
import { DefaultTable } from '../components/Tables/DefaultTable/DefaultTable';
import { SessionTableRow } from '../components/Cards/SessionTableRow';
import { Select } from '../components/Select/Select';
import { HeadingSecondary } from '../components/Typography/HeadingSecondary';
import { SelectMulti } from '../components/Select/SelectMulti';

type SessionsFilters = {
    platform?: string;
    device?: string;
    identifier?: string;
    session_id?: string[];
    version?: string;
};

export const SessionsPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sessions, setSessions] = useState<Session | null>(null);
    const [filters, setFilters] = useState<SessionsFilters | undefined>(undefined);
    const [filteredSessions, setFilteredSessions] = useState<Session | null>(sessions);

    useEffect(() => {
        const fetchSessions = async () => {
            const sessionsData = await getSessions(page, pageSize);
            setSessions(sessionsData);
            setFilteredSessions(sessionsData);
        };

        fetchSessions();
    }, [page, pageSize]);

    useEffect(() => {
        const fetchSessionsWithFilters = async () => {
            if (filters) {
                const sessionsData = await getSessionsWithFilters(page, pageSize, filters);
                setFilteredSessions(sessionsData);
            }
        };

        fetchSessionsWithFilters();
    }, [page, pageSize, filters]);

    const uniqueElements = (array: string[]) => {
        return array.filter((item, index) => array.indexOf(item) === index);
    };

    if (!sessions?.sessions || !filteredSessions?.sessions) {
        return <div />;
    }

    return (
        <div>
            <HeadingSecondary>Compare sessions by selecting filters below</HeadingSecondary>

            <div className='flex flex-wrap gap-3 my-8'>
                <SelectMulti
                    selectLabel='Sessions'
                    selectOptions={sessions?.sessions.map((session) => session.session)}
                    selectValue={filters?.session_id || []}
                    selectOnChange={(e) =>
                        setFilters({
                            ...filters,
                            session_id: e as any,
                        })
                    }
                />

                <Select
                    selectLabel='Version'
                    selectOptions={uniqueElements(
                        sessions?.sessions.map((session) => session.version),
                    )}
                    selectValue={filters?.version || ''}
                    selectOnChange={(e) =>
                        setFilters({
                            ...filters,
                            version: e.toString(),
                        })
                    }
                />

                <Select
                    selectLabel='Platform'
                    selectOptions={uniqueElements(
                        sessions?.sessions.map((session) => session.platform),
                    )}
                    selectValue={filters?.platform || ''}
                    selectOnChange={(e) =>
                        setFilters({
                            ...filters,
                            platform: e.toString(),
                        })
                    }
                />

                <Select
                    selectLabel='Identifier'
                    selectOptions={uniqueElements(
                        sessions?.sessions.map((session) => session.identifier),
                    )}
                    selectValue={filters?.identifier || ''}
                    selectOnChange={(e) =>
                        setFilters({
                            ...filters,
                            identifier: e.toString(),
                        })
                    }
                />

                <Select
                    selectLabel='Device'
                    selectOptions={uniqueElements(
                        sessions?.sessions.map((session) => session.device),
                    )}
                    selectValue={filters?.device || ''}
                    selectOnChange={(e) =>
                        setFilters({
                            ...filters,
                            device: e.toString(),
                        })
                    }
                />
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
