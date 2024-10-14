import { CustomNavLink } from '../Links/CustomNavLink';

export const Header: React.FC = () => {
    return (
        <header className='w-full h-32 bg-gray-800 text-white border-b border-gray-800 flex flex-col'>
            <div className='h-16 flex'>
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

                <nav className='flex-1 flex ms-8 items-center'>
                    <CustomNavLink link='/sessions'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='24px'
                            viewBox='0 -960 960 960'
                            width='24px'
                            fill='#e8eaed'>
                            <path d='M480-520q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600ZM240-280v-76q0-21 10.5-39.5T279-425q45-26 95-40.5T480-480q56 0 106 14.5t95 40.5q18 11 28.5 29.5T720-356v76H240Zm240-120q-41 0-80 10t-74 30h308q-35-20-74-30t-80-10Zm369-234q-31-73-86.5-128.5T634-849l31-74q88 36 154.5 103T923-665l-74 31Zm-738 0-74-31q37-88 103.5-154.5T295-923l31 74q-73 31-128.5 86.5T111-634ZM295-37q-88-36-154.5-103T37-295l74-31q31 73 86.5 128.5T326-111l-31 74Zm370 0-31-74q73-31 128.5-86.5T849-326l74 31q-36 88-103 154.5T665-37ZM480-640Zm0 280h154-308 154Z' />
                        </svg>
                        Sessions
                    </CustomNavLink>
                </nav>
            </div>

            <div className='bg-gray-700 w-full h-16 flex items-center'>
                <div className='flex gap-3 ms-8'>
                    <CustomNavLink link='#'>
                        FPS
                    </CustomNavLink>

                    <CustomNavLink link='#'>
                        Memory Usage
                    </CustomNavLink>

                    <CustomNavLink link='#'>
                        Render Counts
                    </CustomNavLink>

                    <CustomNavLink link='#'>
                        Render Memory
                    </CustomNavLink>
                </div>
            </div>
        </header>
    );
};
