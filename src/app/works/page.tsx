import WorkFilterContainer from "@/components/WorkFilterContainer";
import { getWorks } from "@/lib/microcms";

export const dynamic = 'force-dynamic';

export default async function WorksPage() {
  const works = await getWorks();

  return (
    <div className="container-custom py-32 bg-[#FFFEF0] min-h-screen">
      <h1 className="text-6xl md:text-8xl font-black uppercase mb-16 bg-[#FF3366] text-white px-8 py-4 border-8 border-black inline-block" style={{ boxShadow: '12px 12px 0 black' }}>All Works</h1>
      
      <WorkFilterContainer initialWorks={works} />
    </div>
  );
}
