'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  categories: string[];
  selectedCategory: string;
};

export default function CategoryFilter({ categories, selectedCategory }: Props) {
  const pathname = usePathname();

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="mb-12 flex flex-wrap gap-3">
      <Link
        href={pathname}
        className={`px-6 py-2 font-bold uppercase text-sm border-4 border-black transition-all ${
          selectedCategory === 'all'
            ? 'bg-[#FF3366] text-white translate-y-0'
            : 'bg-white text-black hover:translate-y-1'
        }`}
        style={{ boxShadow: selectedCategory === 'all' ? '0 0 0 black' : '4px 4px 0 black' }}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`${pathname}?category=${encodeURIComponent(category)}`}
          className={`px-6 py-2 font-bold uppercase text-sm border-4 border-black transition-all ${
            selectedCategory === category
              ? 'bg-[#FF3366] text-white translate-y-0'
              : 'bg-white text-black hover:translate-y-1'
          }`}
          style={{ boxShadow: selectedCategory === category ? '0 0 0 black' : '4px 4px 0 black' }}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}
