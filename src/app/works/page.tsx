import WorkList from "@/components/WorkList";
import CategoryFilter from "@/components/CategoryFilter";
import { getWorks } from "@/lib/microcms";

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function WorksPage({ searchParams }: Props) {
  const params = await searchParams;
  // Decode the category from URL parameter
  const selectedCategory = params.category ? decodeURIComponent(params.category).trim() : 'all';
  
  const works = await getWorks();
  
  // Normalize categories (trim whitespace)
  const normalizedWorks = works.map(work => ({
    ...work,
    category: Array.isArray(work.category) 
      ? work.category.map(c => typeof c === 'string' ? c.trim() : String(c))
      : []
  }));

  // Extract all unique categories from works
  const allCategories = Array.from(
    new Set(normalizedWorks.flatMap((work) => work.category))
  ).sort();

  // Filter works based on selected category
  const filteredWorks = selectedCategory === 'all'
    ? normalizedWorks
    : normalizedWorks.filter((work) => work.category.includes(selectedCategory));

  return (
    <div className="container-custom py-32 bg-[#FFFEF0] min-h-screen">
      {/* DEBUG INFO - REMOVE BEFORE PRODUCTION */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 text-xs z-50 opacity-80 overflow-auto max-h-40 hidden">
        <p>Selected: {selectedCategory}</p>
        <p>Categories: {JSON.stringify(allCategories)}</p>
        <p>First Work Categories: {JSON.stringify(normalizedWorks[0]?.category)}</p>
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
