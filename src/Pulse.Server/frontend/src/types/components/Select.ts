export interface SelectProps {
    selectLabel: string;
    selectOptions: string[] | number[];
    selectOnChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    selectValue: any[] | string | number;
}
