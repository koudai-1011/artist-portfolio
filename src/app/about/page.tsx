import Image from "next/image";
import { getProfile } from "@/lib/microcms";
import { FaInstagram, FaTwitter } from "react-icons/fa";

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <div className="container-custom py-32 bg-[#FFFEF0] min-h-screen">
      <div className="max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-black uppercase mb-16 bg-[#3366FF] text-white px-8 py-4 border-8 border-black inline-block" style={{ boxShadow: '12px 12px 0 black' }}>About</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <div className="relative aspect-square overflow-hidden border-8 border-black" style={{ boxShadow: '12px 12px 0 black' }}>
              <Image
                src={profile.avatar.url}
                alt={profile.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-4xl font-black uppercase bg-[#FFCC00] px-4 py-2 border-4 border-black inline-block mb-6" style={{ boxShadow: '6px 6px 0 black' }}>
                {profile.name}
              </h2>
              <p className="text-lg leading-relaxed bg-white p-6 border-4 border-black" style={{ boxShadow: '6px 6px 0 black' }}>
                {profile.bio}
              </p>
            </div>

            <div className="flex gap-4">
              {profile.sns.map((social) => (
                <Link
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 font-bold uppercase bg-[#00FF99] border-4 border-black hover:translate-y-1 transition-transform"
                  style={{ boxShadow: '4px 4px 0 black' }}
                >
                  {social.platform}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
