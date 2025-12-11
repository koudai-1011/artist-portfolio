'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { News } from '@/lib/microcms';
import Link from 'next/link';
import CategoryFilter from './CategoryFilter';
import SortDropdown from './SortDropdown';
import { useState } from 'react';

type Props = {
  initialNews: News[];
  dateFormat: string;
};

type SortType = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

export default function NewsFilterContainer({ initialNews, dateFormat }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get category and sort from URL
  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = (searchParams.get('sort') || 'newest') as SortType;

  // Normalize news data
  const normalizedNews = initialNews.map(item => ({
    ...item,
    category: typeof item.category === 'string' ? item.category.trim() : String(item.category || '')
  }));

  // Extract unique categories
  const allCategories = Array.from(
    new Set(normalizedNews.filter((item) => item.category).map((item) => item.category!))
  ).sort().filter(c => c !== 'undefined' && c !== '');

  // Filter news
  let filteredNews = currentCategory === 'all'
    ? normalizedNews
    : normalizedNews.filter((item) =>
      item.category && item.category.toLowerCase() === currentCategory.toLowerCase()
    );

  // Sort news
  filteredNews = [...filteredNews].sort((a, b) => {
    switch (currentSort) {
      case 'oldest':
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      case 'title-asc':
        return a.title.localeCompare(b.title, 'ja');
      case 'title-desc':
        return b.title.localeCompare(a.title, 'ja');
      case 'newest':
      default:
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  });

  // Debug info state
  const [showDebug, setShowDebug] = useState(false);

  // Date formatter helper
  const formatDate = (item: News) => {
    // Use displayDate if available, otherwise fall back to publishedAt
    const dateString = item.displayDate || item.publishedAt;

    // If displayDate is in YYYY/MM/DD format, return as-is
    if (item.displayDate && /^\d{4}\/\d{2}\/\d{2}$/.test(item.displayDate)) {
      return item.displayDate;
    }

    // Otherwise format publishedAt
    const date = new Date(dateString);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return dateFormat
      .replace('yyyy', year)
      .replace('MM', month)
      .replace('dd', day);
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      {/* Debug Toggle */}
      {showDebug && (
        <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 text-xs z-50 opacity-90 overflow-auto max-h-60 border-t-4 border-[#FF66CC]">
          <p className="font-bold text-[#FF66CC]">CLIENT DEBUG MODE</p>
          <p>Current Category: "{currentCategory}"</p>
          <p>Filtered: {filteredNews.length} / {initialNews.length}</p>
        </div>
      )}

      <CategoryFilter
        categories={allCategories}
        selectedCategory={currentCategory}
      />

      {/* Sort Bar */}
      <div className="mb-8">
        <SortDropdown
          options={[
            { label: '新しい順', value: 'newest' },
            { label: '古い順', value: 'oldest' },
            { label: 'タイトル (A-Z)', value: 'title-asc' },
            { label: 'タイトル (Z-A)', value: 'title-desc' },
          ]}
          value={currentSort}
          onChange={handleSortChange}
        />
      </div>

      <div className="max-w-3xl space-y-8">
        {filteredNews.map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.id}`}
            className="block group"
          >
            <div className="bg-white border-6 border-black hover:translate-y-1 transition-transform overflow-hidden" style={{ boxShadow: '8px 8px 0 black' }}>
              <div className="flex gap-4 h-32">
                {/* Thumbnail */}
                {item.thumbnail && (
                  <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.thumbnail.url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <time className="text-sm font-bold bg-[#FFCC00] px-2 py-1 border-2 border-black">
                        {formatDate(item)}
                      </time>
                      {item.category && (
                        <span className="px-2 py-1 bg-[#3366FF] text-white text-xs font-bold uppercase border-2 border-black">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-black uppercase group-hover:text-[#FF3366] line-clamp-2">
                      {item.title}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {filteredNews.length === 0 && (
          <div className="text-center py-12 bg-white p-8 border-4 border-black" style={{ boxShadow: '8px 8px 0 black' }}>
            <p className="font-bold uppercase">
              {currentCategory === 'all' ? 'お知らせはまだありません。' : 'このカテゴリのお知らせはありません。'}
            </p>
          </div>
        )}
      </div >
    </>
  );
}
