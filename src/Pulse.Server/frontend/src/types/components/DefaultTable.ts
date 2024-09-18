import { ReactNode } from 'react';

export interface DefaultTableHeaderProps {
    headers: string[];
}

export interface DefaultTableProps {
    tableData: any[];
    tableHeaders: string[];
    tableTitle?: string;
    tableTitleDescription?: string;
    children?: ReactNode;
}

export interface DefaultTableBodyProps {
    tableData: any[];
}
