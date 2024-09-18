import { CustomNavLink } from '../Links/CustomNavLink';

export const Sidebar: React.FC = () => {
    return (
        <div className='flex flex-col w-64 h-screen bg-gray-800 text-white border-r border-gray-800'>
            <div className='flex items-center justify-center h-16 bg-gray-900'>
                <h1 className='text-2xl font-bold'>Unity Pulse</h1>
            </div>

            <div className='flex flex-col p-6'>
                <CustomNavLink link='/'>Home</CustomNavLink>
                <CustomNavLink link='/sessions'>Sessions</CustomNavLink>
            </div>
        </div>
    );
};
