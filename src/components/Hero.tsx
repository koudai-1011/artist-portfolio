'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

type Props = {
  title?: string;
  subtitle?: string;
  image?: {
    url: string;
    height: number;
    width: number;
  };
};

export default function Hero({ title, subtitle, image }: Props) {
  // If no content is provided, don't render anything
  if (!title && !subtitle && !image) {
    return null;
  }

  const titleLines = title ? title.split('\\n') : [];

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-[#FF66CC] halftone-bg">
      {/* Background image if provided */}
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image.url}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#FF66CC]/70 mix-blend-multiply" />
        </div>
      )}

      {/* Comic-style burst background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#FFCC00] rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#3366FF] rounded-full blur-3xl" />
      </div>

      <div className="container-custom z-10 text-center">
        {title && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
          >
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none bg-white px-8 py-6 border-8 border-black rotate-[-2deg] mb-8"
                style={{ boxShadow: '12px 12px 0 black' }}>
              {titleLines.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </motion.div>
        )}
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl font-bold uppercase tracking-widest bg-[#FFCC00] inline-block px-6 py-3 border-4 border-black"
            style={{ boxShadow: '6px 6px 0 black' }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
