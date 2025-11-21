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

  // Extract all unique categories from works
  const allCategories = Array.from(
    new Set(works.flatMap((work) => work.category))
  ).sort();

  // Filter works based on selected category
  const filteredWorks = selectedCategory === 'all'
    ? works
    : works.filter((work) => work.category.includes(selectedCategory));

  return (
    <div className="container-custom py-32 bg-[#FFFEF0] min-h-screen">
      <h1 className="text-6xl md:text-8xl font-black uppercase mb-16 bg-[#FF3366] text-white px-8 py-4 border-8 border-black inline-block" style={{ boxShadow: '12px 12px 0 black' }}>All Works</h1>
      
      <CategoryFilter
        categories={allCategories}
        selectedCategory={selectedCategory}
      />

      <WorkList works={filteredWorks} />
    </div>
  );
}
