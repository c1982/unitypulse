import { NavLink } from 'react-router-dom';

interface NavLinkProps {
    children: React.ReactNode;
    link: string;
}

export const CustomNavLink: React.FC<NavLinkProps> = ({ children, link, ...props }) => {
    return (
        <NavLink
            {...props}
            className='p-3 rounded-lg text-white hover:bg-gray-900 hover:text-white flex gap-2 items-center'
            to={link}>
            {children}
        </NavLink>
    );
};
