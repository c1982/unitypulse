import { Sidebar } from './Sidebar';
import { Main } from './Main';

export const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className='flex w-full flex fixed'>
            <Sidebar />
            <Main>{children}</Main>
        </div>
    );
};
