import React, { useState } from 'react';
import { SelectProps } from '../../types/components/Select';

export const SelectMulti: React.FC<SelectProps> = ({
    selectLabel,
    selectOptions,
    selectOnChange,
    selectValue = [],
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelectOption = (option: string | number) => {
        const isSelected = Array.isArray(selectValue) && selectValue.includes(option);
        let newSelectedValues: (string | number)[];

        if (isSelected) {
            newSelectedValues = (selectValue as any[]).filter((value) => value !== option);
        } else {
            newSelectedValues = [...(selectValue as any[]), option];
        }

        selectOnChange(newSelectedValues as any);
    };

    return (
        <div className='relative w-96'>
            <label className='text-sm font-semibold text-gray-700 mb-2 block'>{selectLabel}</label>

            <div className='relative'>
                <button
                    onClick={toggleDropdown}
                    className='w-full flex justify-between items-center bg-white border border-gray-300 rounded-md px-3 py-2 mt-1 transition duration-200 ease-in-out'>
                    {Array.isArray(selectValue) && selectValue.length > 0
                        ? selectValue.join(', ')
                        : 'Select options'}
                    <svg
                        className={`w-5 h-5 transition-transform ${
                            isOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M19 9l-7 7-7-7'
                        />
                    </svg>
                </button>

                {isOpen && (
                    <ul className='absolute z-10 mt-1 w-full bg-white shadow-lg border border-gray-200 rounded-md'>
                        {selectOptions.map((option, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelectOption(option)}
                                className={`px-4 py-2 text-gray-700 hover:bg-slate-100 cursor-pointer ${
                                    Array.isArray(selectValue) && selectValue.includes(option)
                                        ? 'bg-slate-200'
                                        : ''
                                }`}>
                                <input
                                    type='checkbox'
                                    className='mr-2'
                                    checked={
                                        Array.isArray(selectValue) && selectValue.includes(option)
                                    }
                                    onChange={() => handleSelectOption(option)}
                                />
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
