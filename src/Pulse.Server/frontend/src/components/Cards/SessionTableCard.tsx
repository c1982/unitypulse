import { SessionData } from '../../types/session';
import { useUTCDate } from '../../hooks/useUTCDate';

export const SessionTableCard: React.FC<{ session: SessionData }> = ({ session }) => {
    const startUTC = useUTCDate(session.start_time);
    const stopUTC = useUTCDate(session.stop_time);

    return (
        <tr className='border-b border-dashed last:border-b-0'>
            <td className='ps-3 p-3 pl-0'>
                <span className='font-semibold text-gray-600 text-md/normal'>
                    {session.session}
                </span>
            </td>

            <td className='p-3 pr-0'>
                <span className='font-semibold text-gray-600 text-md/normal'>
                    {session.identifier}
                </span>
            </td>

            <td className='p-3 pr-0'>
                <span className='font-semibold text-gray-600 text-md/normal'>
                    {session.version}
                </span>
            </td>

            <td className='p-3 pr-12'>
                <span className='font-semibold text-gray-600 text-md/normal'>
                    {session.platform}
                </span>
            </td>

            <td className='p-3'>
                <span className='font-semibold text-gray-600 text-md/normal'>{session.device}</span>
            </td>

            <td className='p-3'>
                <span className='font-semibold text-gray-600 text-md/normal'>{startUTC}</span>
            </td>

            <td className='p-3'>
                <span className='font-semibold text-gray-600 text-md/normal'>{stopUTC}</span>
            </td>

            <td className='p-3 pr-0'>
                <button className='text-primary-dark hover:text-primary-light bg-gray-200 hover:bg-gray-300 rounded-md px-3 py-1 text-sm font-medium'>
                    Details
                </button>
            </td>
        </tr>
    );
};
