'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

type SortOption = {
    label: string;
    value: string;
};

type FilterOption = {
    label: string;
    value: string;
};

type Props = {
    sortOptions: SortOption[];
    filterOptions?: FilterOption[];
    onSortChange?: (sort: string) => void;
    defaultSort?: string;
};

export default function AdvancedFilterBar({
    sortOptions,
    filterOptions = [],
    onSortChange,
    defaultSort = 'default',
}: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [currentSort, setCurrentSort] = useState(defaultSort);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value;
        setCurrentSort(newSort);

        // Update URL with sort parameter
        const params = new URLSearchParams(searchParams);
        params.set('sort', newSort);
        router.push(`?${params.toString()}`, { scroll: false });

        onSortChange?.(newSort);
    };

    return (
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Sort Select */}
            <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm font-bold uppercase">
                    並び替え：
                </label>
                <select
                    id="sort"
                    value={currentSort}
                    onChange={handleSortChange}
                    className="px-4 py-2 border-2 border-black font-bold uppercase bg-white text-black hover:bg-gray-100 transition-colors"
                    style={{ boxShadow: '2px 2px 0 black' }}
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Filter Info */}
            {filterOptions.length > 0 && (
                <div className="text-xs text-gray-500">
                    絞り込み条件: {filterOptions.map(f => f.label).join(' + ')}
                </div>
            )}
        </div>
    );
}
