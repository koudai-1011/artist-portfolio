'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Work } from '@/lib/microcms';
import WorkList from './WorkList';
import CategoryFilter from './CategoryFilter';
import { useEffect, useState } from 'react';

type Props = {
  initialWorks: Work[];
};

export default function WorkFilterContainer({ initialWorks }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Get category from URL or default to 'all'
  const currentCategory = searchParams.get('category') || 'all';
  
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
  const filteredWorks = currentCategory === 'all'
    ? normalizedWorks
    : normalizedWorks.filter((work) => 
        work.category.some(c => c.toLowerCase() === currentCategory.toLowerCase())
      );

  // Debug info state
  const [showDebug, setShowDebug] = useState(false);

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

      <WorkList works={filteredWorks} />
    </>
  );
}
