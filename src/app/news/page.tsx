import NewsFilterContainer from "@/components/NewsFilterContainer";
import { getNews } from "@/lib/microcms";

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div className="container-custom py-32 bg-[#FFFEF0] min-h-screen">
      <h1 className="text-6xl md:text-8xl font-black uppercase mb-16 bg-[#FF66CC] text-white px-8 py-4 border-8 border-black inline-block" style={{ boxShadow: '12px 12px 0 black' }}>News</h1>
      
      <NewsFilterContainer initialNews={news} />
    </div>
  );
}
