import Link from "next/link";
import { getNews } from "@/lib/microcms";
import CategoryFilter from "@/components/CategoryFilter";

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function NewsPage({ searchParams }: Props) {
  const params = await searchParams;
  // Decode the category from URL parameter
  const selectedCategory = params.category ? decodeURIComponent(params.category).trim() : 'all';
  
  const news = await getNews();

  // Normalize categories (trim whitespace)
  const normalizedNews = news.map(item => ({
    ...item,
    category: typeof item.category === 'string' ? item.category.trim() : String(item.category || '')
  }));

  // Extract all unique categories from news (excluding undefined/empty)
  const allCategories = Array.from(
    new Set(normalizedNews.filter((item) => item.category).map((item) => item.category!))
  ).sort().filter(c => c !== 'undefined' && c !== '');

  // Filter news based on selected category (Case insensitive)
  const filteredNews = selectedCategory === 'all'
    ? normalizedNews
    : normalizedNews.filter((item) => 
        item.category && item.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  return (
    <div className="container-custom py-32 bg-[#FFFEF0] min-h-screen">
      {/* DEBUG INFO - ENABLED FOR TROUBLESHOOTING */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 text-xs z-50 opacity-90 overflow-auto max-h-60 border-t-4 border-[#FF66CC]">
        <p className="font-bold text-[#FF66CC]">DEBUG MODE</p>
        <p>URL Param: "{selectedCategory}"</p>
        <p>Categories Found: {JSON.stringify(allCategories)}</p>
        <p>Filtered Count: {filteredNews.length} / {news.length}</p>
      </div>

      <h1 className="text-6xl md:text-8xl font-black uppercase mb-16 bg-[#FF66CC] text-white px-8 py-4 border-8 border-black inline-block" style={{ boxShadow: '12px 12px 0 black' }}>News</h1>

      <CategoryFilter
        categories={allCategories}
        selectedCategory={selectedCategory}
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
                  {new Date(item.publishedAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
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
              {selectedCategory === 'all' ? 'お知らせはまだありません。' : 'このカテゴリのお知らせはありません。'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
