import Link from 'next/link';
import { FaLink } from 'react-icons/fa';
import { Config } from '@/lib/microcms';

type Props = {
  config: Config;
};

export default function Footer({ config }: Props) {
  const copyrightText = config.copyright || `© ${new Date().getFullYear()} ${config.siteName}`;
  const snsLink = config.snsLink || '#';

  return (
    <footer className="py-12 mt-20 bg-[#3366FF] border-t-8 border-black">
      <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm font-bold bg-white px-4 py-2 border-4 border-black">
          {copyrightText}
        </div>

        {config.snsLink && (
          <Link
            href={snsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 flex items-center gap-2 bg-[#FF3366] text-white font-bold uppercase border-4 border-black hover:translate-y-1 transition-transform"
            style={{ boxShadow: '4px 4px 0 black' }}
          >
            <FaLink size={20} />
            <span>SNS</span>
          </Link>
        )}
      </div>
    </footer>
  );
}
