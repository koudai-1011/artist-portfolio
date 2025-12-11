'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaChevronDown } from 'react-icons/fa';

type Props = {
    categories: string[];
    selectedCategory: string;
};

export default function CategoryDropdown({ categories, selectedCategory }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const displayLabel = selectedCategory === 'all' ? 'All Categories' : selectedCategory;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (category: string) => {
        const params = new URLSearchParams(searchParams);
        if (category === 'all') {
            params.delete('category');
        } else {
            params.set('category', category);
        }
        router.push(`?${params.toString()}`);
        setIsOpen(false);
    };

    if (categories.length === 0) {
        return null;
    }

    return (
        <div ref={dropdownRef} className="relative inline-block mb-8">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-6 py-2 font-bold uppercase text-sm border-4 border-black bg-white text-black transition-all flex items-center gap-2 hover:translate-y-1"
                style={{ boxShadow: '4px 4px 0 black' }}
            >
                {displayLabel}
                <FaChevronDown
                    className={`transition-transform text-sm ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white border-4 border-black z-50 min-w-max"
                    style={{ boxShadow: '4px 4px 0 black' }}
                >
                    <button
                        onClick={() => handleSelect('all')}
                        className={`block w-full text-left px-6 py-3 font-bold uppercase text-sm border-b-2 border-black transition-colors ${selectedCategory === 'all'
                            ? 'bg-[#FF66CC] text-white'
                            : 'bg-white text-black hover:bg-[#FF66CC] hover:text-white'
                            }`}
                    >
                        All Categories
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleSelect(category)}
                            className={`block w-full text-left px-6 py-3 font-bold uppercase text-sm border-b-2 border-black last:border-b-0 transition-colors ${selectedCategory === category
                                ? 'bg-[#FF66CC] text-white'
                                : 'bg-white text-black hover:bg-[#FF66CC] hover:text-white'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
