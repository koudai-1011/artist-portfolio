'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Work } from '@/lib/microcms';

type Props = {
  work: Work;
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const colors = ['#FF3366', '#3366FF', '#FFCC00', '#00FF99', '#FF66CC'];

export default function WorkItem({ work }: Props) {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <Link href={`/works/${work.id}`} className="block group">
      <motion.div
        variants={item}
        className="relative overflow-hidden aspect-[4/3] mb-4 border-8 border-black group-hover:scale-[1.02] transition-transform"
        style={{ boxShadow: '8px 8px 0 black' }}
      >
        <Image
          src={work.image[0]?.url}
          alt={work.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>

      <div className="flex flex-col gap-2">
        <h3
          className="text-xl font-black uppercase px-3 py-2 border-4 border-black inline-block"
          style={{
            backgroundColor: randomColor,
            boxShadow: '4px 4px 0 black'
          }}
        >
          {work.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-white border-2 border-black inline-block w-fit">
            {work.category[0]}
          </span>
          {work.displayYear && (
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-gray-100 border-2 border-black inline-block w-fit">
              {work.displayYear}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
