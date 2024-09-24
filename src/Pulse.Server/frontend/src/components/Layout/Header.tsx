import { CustomNavLink } from '../Links/CustomNavLink';

export const Header: React.FC = () => {
    return (
        <header className='w-full h-16 bg-gray-800 text-white border-b border-gray-800 flex'>
            <div className='w-64 flex items-center justify-center gap-3 h-full bg-gray-900'>
                <div>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth='1.5'
                        stroke='#ffffff'
                        className='size-6'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25'
                        />
                    </svg>
                </div>

                <h1 className='text-2xl font-bold'>Unity Pulse</h1>
            </div>

            <nav className='flex-1 flex ms-16 items-center'>
                <CustomNavLink link='/sessions'>Sessions</CustomNavLink>
            </nav>
        </header>
    );
};
