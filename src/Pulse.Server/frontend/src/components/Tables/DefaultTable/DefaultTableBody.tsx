import { DefaultTableBodyProps } from '../../../types/components/DefaultTable';

export const DefaultTableBody: React.FC<DefaultTableBodyProps> = ({ tableData }) => {
    return (
        <tbody>
            {tableData?.map((k) => (
                <tr>
                    {Object.keys(k).map((key) => (
                        <td key={key}>
                            <span className='font-semibold text-gray-600 text-xs/normal'>
                                {k[key]}
                            </span>
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
};
