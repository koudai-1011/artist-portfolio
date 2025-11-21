'use client';

import { useState, useEffect } from 'react';
import WorkList from "@/components/WorkList";
import CategoryFilter from "@/components/CategoryFilter";
import { getWorks } from "@/lib/microcms";
import type { Work } from "@/lib/microcms";

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getWorks().then((data) => {
      setWorks(data);
      setIsLoading(false);
    });
  }, []);

  // Extract all unique categories from works
  const allCategories = Array.from(
    new Set(works.flatMap((work) => work.category))
  ).sort();

  // Filter works based on selected category
  const filteredWorks = selectedCategory === 'all'
    ? works
    : works.filter((work) => work.category.includes(selectedCategory));

  if (isLoading) {
    return (
      <div className="container-custom py-32 bg-[#FFFEF0] min-h-screen">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-32 bg-[#FFFEF0] min-h-screen">
      <h1 className="text-6xl md:text-8xl font-black uppercase mb-16 bg-[#FF3366] text-white px-8 py-4 border-8 border-black inline-block" style={{ boxShadow: '12px 12px 0 black' }}>All Works</h1>
      
      <CategoryFilter
        categories={allCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <WorkList works={filteredWorks} />
    </div>
  );
}
