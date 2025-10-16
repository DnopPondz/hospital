import Link from 'next/link';
import { notFound } from 'next/navigation';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
import { getNewsBySlug } from '@/lib/news';

export const dynamic = 'force-dynamic';

function formatThaiDate(value) {
  try {
    return new Intl.DateTimeFormat('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
}

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
              {newsItem.imageUrl && (
                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-100">
                  <img
                    src={newsItem.imageUrl}
                    alt={newsItem.title}
                    className="h-96 w-full object-cover"
                  />
                </div>
              )}
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
