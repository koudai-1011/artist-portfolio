import Link from "next/link";
import { notFound } from "next/navigation";
import { getWork, getWorks } from "@/lib/microcms";
import { FaArrowLeft } from "react-icons/fa";
import ImageSlider from "@/components/ImageSlider";

type Props = {
  params: Promise<{ id: string }>;
};


export async function generateStaticParams() {
  const works = await getWorks();
  return works.map((work) => ({
    id: work.id,
  }));
}

export default async function WorkDetailPage({ params }: Props) {
  const { id } = await params;
  const work = await getWork(id);

  if (!work) {
    notFound();
  }

  return (
    <article className="container-custom py-32">
      <Link
        href="/works"
        className="inline-flex items-center text-sm uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors mb-8"
      >
        <FaArrowLeft className="mr-2" /> Back to Works
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <ImageSlider images={work.image} alt={work.title} />
        </div>

        <div className="lg:col-span-4 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            {work.title}
          </h1>
          
          <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>{work.description}</p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500 uppercase tracking-wider text-xs mb-1">Category</dt>
                <dd>{work.category.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-gray-500 uppercase tracking-wider text-xs mb-1">Year</dt>
                <dd>{new Date(work.publishedAt).getFullYear()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </article>
  );
}
