'use client';

import { useState, useRef, useEffect } from 'react';

type Option = {
    label: string;
    value: string;
};

type Props = {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
};

export default function SortDropdown({ options, value, onChange, label = '並び替え：' }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find(opt => opt.value === value)?.label || label;

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className="flex items-center gap-2" ref={dropdownRef}>
            <label className="text-sm font-bold uppercase">
                {label}
            </label>

            <div className="relative">
                {/* Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-4 py-2 border-4 border-black font-bold uppercase bg-white text-black hover:bg-gray-50 transition-colors flex items-center gap-2"
                    style={{ boxShadow: '4px 4px 0 black' }}
                >
                    <span>{selectedLabel}</span>
                    <svg
                        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div
                        className="absolute top-full left-0 mt-2 w-full bg-white border-4 border-black z-50 overflow-hidden"
                        style={{ boxShadow: '4px 8px 0 black' }}
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`w-full text-left px-4 py-3 font-bold uppercase text-sm transition-colors border-b-2 border-gray-200 last:border-b-0 ${value === option.value
                                        ? 'bg-[#FF66CC] text-white'
                                        : 'bg-white text-black hover:bg-gray-100'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
