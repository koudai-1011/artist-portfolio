'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Work } from '@/lib/microcms';
import WorkList from './WorkList';
import CategoryFilter from './CategoryFilter';
import { useEffect, useState } from 'react';

type Props = {
  initialWorks: Work[];
};

type SortType = 'newest' | 'oldest' | 'year-asc' | 'year-desc' | 'title-asc' | 'title-desc';

export default function WorkFilterContainer({ initialWorks }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get category and sort from URL
  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = (searchParams.get('sort') || 'newest') as SortType;

  // Normalize works data
  const normalizedWorks = initialWorks.map(work => {
    let categories: string[] = [];
    if (Array.isArray(work.category)) {
      categories = work.category.map(c => String(c).trim());
    } else if (work.category) {
      categories = String(work.category).split(',').map(c => c.trim());
    }
    return { ...work, category: categories };
  });

  // Extract unique categories
  const allCategories = Array.from(
    new Set(normalizedWorks.flatMap((work) => work.category))
  ).sort();

  // Filter works
  let filteredWorks = currentCategory === 'all'
    ? normalizedWorks
    : normalizedWorks.filter((work) =>
      work.category.some(c => c.toLowerCase() === currentCategory.toLowerCase())
    );

  // Sort works
  filteredWorks = [...filteredWorks].sort((a, b) => {
    // Helper function to parse displayDate (YYYY/MM/DD format) to Date
    const parseDateString = (dateStr: string | undefined): Date => {
      if (!dateStr) return new Date(0);
      const [year, month, day] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    };

    switch (currentSort) {
      case 'oldest':
        return parseDateString(a.displayDate).getTime() - parseDateString(b.displayDate).getTime();
      case 'year-asc':
        const dateA = parseDateString(a.displayDate);
        const dateB = parseDateString(b.displayDate);
        return dateA.getFullYear() - dateB.getFullYear();
      case 'year-desc':
        const dateA2 = parseDateString(a.displayDate);
        const dateB2 = parseDateString(b.displayDate);
        return dateB2.getFullYear() - dateA2.getFullYear();
      case 'title-asc':
        return a.title.localeCompare(b.title, 'ja');
      case 'title-desc':
        return b.title.localeCompare(a.title, 'ja');
      case 'newest':
      default:
        return parseDateString(b.displayDate).getTime() - parseDateString(a.displayDate).getTime();
    }
  });

  // Debug info state
  const [showDebug, setShowDebug] = useState(false);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      {/* Debug Toggle (Hidden by default, can be enabled via console) */}
      {showDebug && (
        <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 text-xs z-50 opacity-90 overflow-auto max-h-60 border-t-4 border-[#FF3366]">
          <p className="font-bold text-[#FF3366]">CLIENT DEBUG MODE</p>
          <p>Current Category: "{currentCategory}"</p>
          <p>Filtered: {filteredWorks.length} / {initialWorks.length}</p>
        </div>
      )}

      <CategoryFilter
        categories={allCategories}
        selectedCategory={currentCategory}
      />

      {/* Sort Bar */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="works-sort" className="text-sm font-bold uppercase">
            並び替え：
          </label>
          <select
            id="works-sort"
            value={currentSort}
            onChange={handleSortChange}
            className="px-4 py-2 border-2 border-black font-bold uppercase bg-white text-black hover:bg-gray-100 transition-colors"
            style={{ boxShadow: '2px 2px 0 black' }}
          >
            <option value="newest">新しい順</option>
            <option value="oldest">古い順</option>
            <option value="year-asc">年度 (小→大)</option>
            <option value="year-desc">年度 (大→小)</option>
            <option value="title-asc">タイトル (A-Z)</option>
            <option value="title-desc">タイトル (Z-A)</option>
          </select>
        </div>
      </div>

      <WorkList works={filteredWorks} />
    </>
  );
}
