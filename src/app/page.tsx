import Hero from "@/components/Hero";
import WorkList from "@/components/WorkList";
import { getWorks, getConfig } from "@/lib/microcms";

export default async function Home() {
  const [works, config] = await Promise.all([getWorks(), getConfig()]);

  return (
    <>
      <Hero title={config.heroTitle} subtitle={config.heroSubtitle} image={config.heroImage} />
      <section className="container-custom py-24 bg-[#FFFEF0]">
        <div className="mb-16 flex items-end justify-between">
          <h2 className="text-5xl font-black uppercase bg-[#00FF99] px-6 py-3 border-6 border-black inline-block" style={{ boxShadow: '8px 8px 0 black' }}>Selected Works</h2>
          <span className="hidden md:block text-sm uppercase tracking-widest text-gray-500">
            Curated Portfolio
          </span>
        </div>
        <WorkList works={works} />
      </section>
    </>
  );
}
