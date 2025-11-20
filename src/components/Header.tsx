'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const navItems = [
  { name: 'Works', path: '/works' },
  { name: 'News', path: '/news' },
  { name: 'About', path: '/about' },
];

type Props = {
  siteName?: string;
};

export default function Header({ siteName = 'Artist Name' }: Props) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#FFCC00] border-b-4 border-black">
      <div className="container-custom flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-black tracking-tighter uppercase bg-[#FF3366] text-white px-4 py-2 border-4 border-black rotate-[-2deg] hover:rotate-0 transition-transform">
          {siteName}
        </Link>

        <nav className="hidden md:block">
          <ul className="flex space-x-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  href={item.path} 
                  className={`relative px-4 py-2 font-bold uppercase tracking-wider text-sm border-4 border-black transition-all ${
                    pathname === item.path
                      ? 'bg-[#3366FF] text-white translate-y-1 shadow-none'
                      : 'bg-white hover:translate-y-1 hover:shadow-none'
                  }`}
                  style={{
                    boxShadow: pathname === item.path ? 'none' : '4px 4px 0 black'
                  }}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Mobile Menu */}
        <nav className="md:hidden flex space-x-2">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`px-3 py-2 text-xs font-bold uppercase border-3 border-black ${
                pathname === item.path ? 'bg-[#FF3366] text-white' : 'bg-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
