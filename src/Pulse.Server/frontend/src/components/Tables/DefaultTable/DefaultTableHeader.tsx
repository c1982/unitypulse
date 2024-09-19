import { DefaultTableHeaderProps } from '../../../types/components/DefaultTable';

export const DefaultTableHeader: React.FC<DefaultTableHeaderProps> = ({ headers }) => {
    return (
        <thead className='align-bottom'>
            <tr className='font-semibold text-[1rem] text-secondary-dark'>
                {headers.map((header, headerIndex) => (
                    <th key={headerIndex} className='pb-3 text-start'>
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
    );
};
