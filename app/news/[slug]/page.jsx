import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
import { getNewsBySlug } from '@/lib/news';
import { formatThaiDate, importanceLabel } from '@/lib/news-helpers';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const newsItem = await getNewsBySlug(params.slug);

  if (!newsItem) {
    return {
      title: 'ไม่พบข่าว',
      description: 'ไม่พบข้อมูลข่าวที่คุณต้องการ'
    };
  }

  return {
    title: `${newsItem.title} | ThaiGov Portal`,
    description: newsItem.summary
  };
}

export default async function NewsDetailPage({ params }) {
  const newsItem = await getNewsBySlug(params.slug);

  if (!newsItem) {
    notFound();
  }

  const contentParagraphs = newsItem.content.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const hasAudiences = Array.isArray(newsItem.audiences) && newsItem.audiences.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-slate-50">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <Link href="/news" className="text-sm font-semibold text-primary">
              ← กลับหน้าศูนย์ข่าว
            </Link>
            <div className="mt-6 rounded-3xl border border-slate-100 bg-white p-10 shadow-sm">
              <SectionTitle title={newsItem.title} subtitle={formatThaiDate(newsItem.date)} />
              {newsItem.image ? (
                <div className="mt-6 overflow-hidden rounded-3xl bg-slate-100">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={newsItem.image}
                      alt={newsItem.imageAlt ?? newsItem.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 720px, 100vw"
                      priority
                    />
                  </div>
                </div>
              ) : null}
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-primary">
                  {importanceLabel(newsItem.importance)}
                </span>
                {newsItem.category ? (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                    หมวด: {newsItem.category}
                  </span>
                ) : null}
                {newsItem.province ? (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                    พื้นที่: {newsItem.province}
                  </span>
                ) : null}
                {newsItem.tags?.length ? (
                  <div className="flex flex-wrap items-center gap-2 text-primary">
                    {newsItem.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              {hasAudiences ? (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
                  กลุ่มเป้าหมาย: {newsItem.audiences.join(', ')}
                </div>
              ) : null}
              <article className="mt-8 space-y-5 text-base leading-7 text-slate-700">
                {contentParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
