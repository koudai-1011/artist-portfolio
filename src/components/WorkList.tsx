'use client';

import { motion } from 'framer-motion';
import { Work } from '@/lib/microcms';
import WorkItem from './WorkItem';

type Props = {
  works: Work[];
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function WorkList({ works }: Props) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-16"
    >
      {works.map((work) => (
        <WorkItem key={work.id} work={work} />
      ))}
    </motion.div>
  );
}
