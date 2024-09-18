import { SessionData } from '../../types/session';
import { useUTCDate } from '../../hooks/useUTCDate';
import { useState } from 'react';

export const SessionTableCard: React.FC<{ session: SessionData }> = ({ session }) => {
    const startUTC = useUTCDate(session.start_time);
    const stopUTC = useUTCDate(session.stop_time);
    const [sessionDetailVisible, setSessionDetailVisible] = useState(false);

    return (
        <>
            <tr className={sessionDetailVisible ? '' : 'border-b border-dashed last:border-b-0'}>
                <td className='pl-0 p-6'>
                    <span className='font-semibold text-gray-600 text-xs/normal'>
                        {session.session}
                    </span>
                </td>

                <td>
                    <span className='font-semibold text-gray-600 text-xs/normal'>
                        {session.identifier}
                    </span>
                </td>

                <td>
                    <span className='font-semibold text-gray-600 text-xs/normal'>
                        {session.version}
                    </span>
                </td>

                <td>
                    <span className='font-semibold text-gray-600 text-xs/normal'>
                        {session.platform}
                    </span>
                </td>

                <td>
                    <span className='font-semibold text-gray-600 text-xs/normal'>
                        {session.device}
                    </span>
                </td>

                <td>
                    <span className='font-semibold text-gray-600 text-xs/normal'>{startUTC}</span>
                </td>

                <td>
                    <span className='font-semibold text-gray-600 text-xs/normal'>{stopUTC}</span>
                </td>

                <td>
                    <button
                        className='rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                        type='button'
                        onClick={() => setSessionDetailVisible(!sessionDetailVisible)}>
                        Details
                    </button>
                </td>
            </tr>
            {sessionDetailVisible && (
                <tr
                    className={
                        sessionDetailVisible ? 'border-b border-dashed last:border-b-0' : ''
                    }>
                    <td>{sessionDetailVisible ? 'true' : 'false'}</td>
                </tr>
            )}
        </>
    );
};
