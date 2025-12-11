import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsItem, getNews } from "@/lib/microcms";
import { FaArrowLeft } from "react-icons/fa";
import NewsDetailClient from "@/components/NewsDetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const news = await getNews();
  return news.map((item) => ({
    id: item.id,
  }));
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const newsItem = await getNewsItem(id);

  if (!newsItem) {
    notFound();
  }

  return (
    <article className="container-custom py-32">
      <Link
        href="/news"
        className="inline-flex items-center text-sm uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-8"
      >
        <FaArrowLeft className="mr-2" /> Back to News
      </Link>

      <div className="max-w-3xl">
        <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
          <time dateTime={newsItem.publishedAt}>
            {newsItem.displayDate || new Date(newsItem.publishedAt).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {newsItem.category && (
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs uppercase tracking-wider">
              {newsItem.category}
            </span>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8">
          {newsItem.title}
        </h1>

        <NewsDetailClient content={newsItem.content || ''} title={newsItem.title} />
      </div>
    </article>
  );
}
