import { Header } from './Header';

export const Main: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className='flex flex-col flex-1'>
            <Header />
            <main className='flex flex-col w-full p-6'>{children}</main>
        </div>
    );
};
