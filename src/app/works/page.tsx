import WorkList from "@/components/WorkList";
import CategoryFilter from "@/components/CategoryFilter";
import { getWorks } from "@/lib/microcms";

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function WorksPage({ searchParams }: Props) {
  const params = await searchParams;
  // Decode the category from URL parameter
  const selectedCategory = params.category ? decodeURIComponent(params.category).trim() : 'all';
  
  const works = await getWorks();
  
  // Normalize categories (trim whitespace, handle string/array)
  const normalizedWorks = works.map(work => {
    let categories: string[] = [];
    if (Array.isArray(work.category)) {
      categories = work.category.map(c => String(c).trim());
    } else if (work.category) {
      // Handle single string case (e.g. "Painting") or comma separated
      categories = String(work.category).split(',').map(c => c.trim());
    }
    return { ...work, category: categories };
  });

  // Extract all unique categories from works
  const allCategories = Array.from(
    new Set(normalizedWorks.flatMap((work) => work.category))
  ).sort();

  // Filter works based on selected category (Case insensitive)
  const filteredWorks = selectedCategory === 'all'
    ? normalizedWorks
    : normalizedWorks.filter((work) => 
        work.category.some(c => c.toLowerCase() === selectedCategory.toLowerCase())
      );

  return (
    <div className="container-custom py-32 bg-[#FFFEF0] min-h-screen">
      {/* DEBUG INFO - ENABLED FOR TROUBLESHOOTING */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 text-xs z-50 opacity-90 overflow-auto max-h-60 border-t-4 border-[#FF3366]">
        <p className="font-bold text-[#FF3366]">DEBUG MODE</p>
        <p>URL Param: "{selectedCategory}"</p>
        <p>Categories Found: {JSON.stringify(allCategories)}</p>
        <p>Filtered Count: {filteredWorks.length} / {works.length}</p>
        <div className="mt-2 border-t border-gray-700 pt-2">
          <p>First Item Categories: {JSON.stringify(normalizedWorks[0]?.category)}</p>
          <p>Match Check: {normalizedWorks[0]?.category.map(c => `"${c}" vs "${selectedCategory}" (${c.toLowerCase() === selectedCategory.toLowerCase()})`).join(', ')}</p>
        </div>
      </div>

      <h1 className="text-6xl md:text-8xl font-black uppercase mb-16 bg-[#FF3366] text-white px-8 py-4 border-8 border-black inline-block" style={{ boxShadow: '12px 12px 0 black' }}>All Works</h1>
      
      <CategoryFilter
        categories={allCategories}
        selectedCategory={selectedCategory}
      />

      <WorkList works={filteredWorks} />
    </div>
  );
}
