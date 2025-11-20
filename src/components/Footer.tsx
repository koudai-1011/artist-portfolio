import Link from 'next/link';
import { FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="py-12 mt-20 bg-[#3366FF] border-t-8 border-black">
      <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm font-bold bg-white px-4 py-2 border-4 border-black">
          &copy; {new Date().getFullYear()} Artist Name.
        </div>

        <div className="flex space-x-4">
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center bg-[#FF3366] text-white border-4 border-black hover:translate-y-1 transition-transform"
            style={{ boxShadow: '4px 4px 0 black' }}
          >
            <FaInstagram size={24} />
          </Link>
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center bg-[#FFCC00] text-black border-4 border-black hover:translate-y-1 transition-transform"
            style={{ boxShadow: '4px 4px 0 black' }}
          >
            <FaTwitter size={24} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
