'use client';

import { useSearchParams } from 'next/navigation';
import { News } from '@/lib/microcms';
import Link from 'next/link';
import CategoryFilter from './CategoryFilter';
import { useState } from 'react';

type Props = {
  initialNews: News[];
  dateFormat: string;
};

export default function NewsFilterContainer({ initialNews, dateFormat }: Props) {
  const searchParams = useSearchParams();
  
  // Get category from URL or default to 'all'
  const currentCategory = searchParams.get('category') || 'all';
  
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
  const filteredNews = currentCategory === 'all'
    ? normalizedNews
    : normalizedNews.filter((item) => 
        item.category && item.category.toLowerCase() === currentCategory.toLowerCase()
      );

  // Debug info state
  const [showDebug, setShowDebug] = useState(false);

  // Date formatter helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return dateFormat
      .replace('yyyy', year)
      .replace('MM', month)
      .replace('dd', day);
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

      <div className="max-w-3xl space-y-8">
        {filteredNews.map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.id}`}
            className="block group"
          >
            <div className="bg-white p-6 border-6 border-black hover:translate-y-1 transition-transform" style={{ boxShadow: '8px 8px 0 black' }}>
              <div className="flex items-center gap-4 mb-3">
                <time className="text-sm font-bold bg-[#FFCC00] px-3 py-1 border-2 border-black">
                  {formatDate(item.publishedAt)}
                </time>
                {item.category && (
                  <span className="px-3 py-1 bg-[#3366FF] text-white text-xs font-bold uppercase border-2 border-black">
                    {item.category}
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-black uppercase mb-3 group-hover:text-[#FF3366]">
                {item.title}
              </h2>

              <div 
                className="text-gray-700 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: item.content || '' }}
              />
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
      </div>
    </>
  );
}
