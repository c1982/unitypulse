import { useEffect, useState } from 'react';
import { getSessions } from '../services/sessionService';
import { Session } from '../types/session';
import { SessionTableCard } from '../components/Cards/SessionTableCard';

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

    if (!sessions) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className='flex flex-wrap -mx-3 mb-5'>
                <div className='w-full max-w-full px-3 mb-6  mx-auto'>
                    <div className='relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white m-5'>
                        <div className='relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30'>
                            <div className='px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent'>
                                <h3 className='flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark'>
                                    <span className='mr-3 font-semibold text-dark'>Sessions</span>
                                    <span className='mt-1 font-medium text-secondary-dark text-sm/normal'>
                                        Manage your sessions
                                    </span>
                                </h3>
                            </div>

                            <div className='flex-auto block py-8 pt-6 px-9'>
                                <div className='overflow-x-auto'>
                                    <table className='w-full my-0 align-middle text-dark border-neutral-200'>
                                        <thead className='align-bottom border-b'>
                                            <tr className='font-semibold text-[0.95rem] text-secondary-dark'>
                                                <th className='ps-3 pb-3 text-start'>Session ID</th>
                                                <th className='ps-3 pb-3 text-start'>Identifier</th>
                                                <th className='ps-3 pb-3 text-start'>Version</th>
                                                <th className='ps-3 pb-3 text-start'>Platform</th>
                                                <th className='ps-3 pb-3 text-start'>Device</th>
                                                <th className='ps-3 pb-3 text-start'>Start Time</th>
                                                <th className='ps-3 pb-3 text-start'>Stop Time</th>
                                                <th className='ps-3 pb-3 text-start'>Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sessions.sessions.map((session) => (
                                                <SessionTableCard
                                                    key={session.session}
                                                    session={session}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
