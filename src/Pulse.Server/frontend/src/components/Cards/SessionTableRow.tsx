import { SessionData, SessionDetail } from '../../types/session';
import { useUTCDate } from '../../hooks/useUTCDate';
import { useState } from 'react';
import { getSessionDetailByID } from '../../services/sessionService';
import { SessionFPSLineChart } from '../Charts/SessionFPSLineChart';
import { SessionMemoryLineChart } from '../Charts/SessionMemoryLineChart';
import { SessionRenderCountChart } from '../Charts/SessionRenderCountChart';

export const SessionTableRow: React.FC<{ session: SessionData }> = ({ session }) => {
    const startUTC = useUTCDate(session.start_time);
    const stopUTC = useUTCDate(session.stop_time);
    const [sessionDetailVisible, setSessionDetailVisible] = useState(false);
    const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(null);

    const fetchSessionDetail = async (sessionID: string) => {
        const sessionDetailData = await getSessionDetailByID(sessionID);
        setSessionDetail(sessionDetailData);
    };

    return (
        <>
            <tr className='border-b border-dashed'>
                <td className='pl-0 p-6'>
                    <span className='font-semibold text-gray-600 text-sm/normal'>
                        {session.session}
                    </span>
                </td>

                <td>
                    <span className='font-semibold text-gray-600 text-sm/normal'>
                        {session.identifier}
                    </span>
                </td>

                <td>
                    <span className='font-semibold text-gray-600 text-sm/normal'>
                        {session.version}
                    </span>
                </td>

                <td>
                    <span className='font-semibold text-gray-600 text-sm/normal'>
                        {session.platform}
                    </span>
                </td>

                <td>
                    <span className='font-semibold text-gray-600 text-sm/normal'>
                        {session.device}
                    </span>
                </td>

                <td>
                    <span className='font-semibold text-gray-600 text-sm/normal'>{startUTC}</span>
                </td>

                <td>
                    <span className='font-semibold text-gray-600 text-sm/normal'>{stopUTC}</span>
                </td>

                <td>
                    <button
                        className='rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                        type='button'
                        onClick={() => {
                            fetchSessionDetail(session.session);
                            setSessionDetailVisible(!sessionDetailVisible);
                        }}>
                        Details
                    </button>
                </td>
            </tr>

            {sessionDetailVisible && (
                sessionDetail ? (
                    <>
                        <tr className='animate-fade-in-down transition-all duration-300'>
                                <td colSpan={8}>
                                    <div className='flex gap-3'>
                                        <div className='w-1/2'>
                                            <SessionFPSLineChart data={sessionDetail} />
                                        </div>

                                        <div className='w-1/2'>
                                            <SessionMemoryLineChart data={sessionDetail} />
                                        </div>
                                    </div>
                                </td>
                        </tr>
                        
                        <tr>
                            <td colSpan={8}>
                                <div className='flex gap-3'>
                                    <div className='w-1/2'>
                                        <SessionRenderCountChart data={sessionDetail} />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </>
                ) : (
                    <tr>
                        <td>''</td>
                    </tr>
                )
            )}
        </>
    );
};
