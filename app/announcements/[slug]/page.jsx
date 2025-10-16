import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
import { getAnnouncementBySlug } from '@/lib/announcements';
import { recordReadEvent } from '@/lib/logs';

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
  const announcement = await getAnnouncementBySlug(params.slug);

  if (!announcement) {
    return {
      title: 'ไม่พบประกาศ',
      description: 'ไม่พบข้อมูลประกาศที่คุณต้องการ'
    };
  }

  return {
    title: `${announcement.title} | ThaiGov Portal`,
    description: announcement.summary
  };
}

export default async function AnnouncementPage({ params }) {
  const announcement = await getAnnouncementBySlug(params.slug);

  if (!announcement) {
    notFound();
  }

  await recordReadEvent({
    type: 'announcement',
    slug: announcement.slug,
    title: announcement.title
  });

  const contentParagraphs = announcement.content.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-slate-50">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <Link href="/" className="text-sm font-semibold text-primary">
              ← กลับหน้าหลัก
            </Link>
            <div className="mt-6 rounded-3xl border border-slate-100 bg-white p-10 shadow-sm">
              <SectionTitle title={announcement.title} subtitle={formatThaiDate(announcement.date)} />
              {announcement.imageUrl && (
                <div className="relative mt-6 h-96 overflow-hidden rounded-3xl border border-slate-100">
                  <Image
                    src={announcement.imageUrl}
                    alt={announcement.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                    priority
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
