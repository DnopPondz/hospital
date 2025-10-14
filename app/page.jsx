import Image from 'next/image';
import Link from 'next/link';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
import { getAnnouncements } from '@/lib/announcements';
import { getNews } from '@/lib/news';

const campaignHighlights = [
  {
    title: 'สัปดาห์สุขภาพครอบครัวไทย',
    description:
      'รวมกิจกรรมให้ความรู้เรื่องวัคซีน การดูแลผู้สูงอายุ และการป้องกันโรคไม่ติดต่อในทุกจังหวัด',
    location: 'ทั่วประเทศ',
    period: '1 – 7 กรกฎาคม 2567'
  },
  {
    title: 'ศูนย์รับเรื่องร้องเรียนออนไลน์',
    description:
      'เปิดช่องทางใหม่สำหรับรับเรื่องร้องเรียนเกี่ยวกับบริการสาธารณสุข พร้อมทีมเจ้าหน้าที่ตอบกลับภายใน 24 ชั่วโมง',
    location: 'ระบบ ThaiGov Connect',
    period: 'ให้บริการทุกวัน'
  },
  {
    title: 'โครงการหน่วยแพทย์เคลื่อนที่',
    description:
      'ให้บริการตรวจสุขภาพเบื้องต้น จ่ายยา และให้คำปรึกษาในพื้นที่ห่างไกลเพื่อให้ประชาชนเข้าถึงการรักษาได้ทั่วถึง',
    location: 'ภาคเหนือและอีสาน',
    period: 'ตลอดไตรมาส 3/2567'
  }
];

const agencyOverview = [
  {
    name: 'สำนักงานปลัดกระทรวงสาธารณสุข',
    summary: 'ประสานการดำเนินงานของกรมในสังกัด กำกับนโยบาย และติดตามประสิทธิภาพการให้บริการประชาชน',
    focus: 'ยุทธศาสตร์ภาพรวมและการบริหารจัดการ'
  },
  {
    name: 'กรมสนับสนุนบริการสุขภาพ',
    summary: 'ดูแลมาตรฐานสถานพยาบาลทั้งภาครัฐและเอกชน พร้อมส่งเสริมบริการแพทย์ทางไกลและนวัตกรรม',
    focus: 'กำกับมาตรฐานและนวัตกรรมบริการ'
  },
  {
    name: 'กรมควบคุมโรค',
    summary: 'ติดตามสถานการณ์โรคติดต่อ เฝ้าระวังโรคระบาด และให้คำแนะนำเชิงนโยบายในการป้องกันและควบคุมโรค',
    focus: 'ป้องกันควบคุมโรคและภัยสุขภาพ'
  },
  {
    name: 'กรมการแพทย์',
    summary: 'กำหนดมาตรฐานทางการแพทย์ระดับประเทศ พร้อมให้บริการการแพทย์เฉพาะทางผ่านสถาบันในสังกัด',
    focus: 'บริการการแพทย์เฉพาะทางและมาตรฐานวิชาชีพ'
  }
];

const mediaChannels = [
  {
    title: 'ข่าวด่วนและประกาศทางการ',
    description: 'ติดตามประกาศฉบับเต็มและเอกสารสำคัญจากศูนย์ข่าวกระทรวงได้ที่หน้า ข่าว และระบบแจ้งเตือน',
    href: '/news'
  },
  {
    title: 'ข้อมูลเชิงลึกหน่วยงาน',
    description: 'ดูโครงสร้างบุคลากร หน้าที่หลัก และหน่วยงานในสังกัดทั้งหมดได้ในหน้าโครงสร้างบุคลากร',
    href: '/structure'
  },
  {
    title: 'บริการสอบถามเพิ่มเติม',
    description: 'หากต้องการข้อมูลเฉพาะเรื่องหรือคำปรึกษา สามารถกรอกแบบฟอร์มหรือจองเวลานัดหมายผ่านหน้าติดต่อเรา',
    href: '/contact'
  }
];

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

export default async function HomePage() {
  const [newsItems, announcementItems] = await Promise.all([getNews(), getAnnouncements()]);

  const topNews = newsItems.slice(0, 4);
  const featuredNews = topNews[0];
  const secondaryNews = topNews.slice(1);
  const latestAnnouncements = announcementItems.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#e9f5ee] via-white to-[#cfe7d7]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(104,194,139,0.22),_transparent_55%)]" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-primary shadow-sm">
                <span className="h-2 w-2 rounded-full bg-primary" />
                ศูนย์ประชาสัมพันธ์กระทรวงสาธารณสุข
              </span>
              <h1 className="text-3xl font-semibold text-neutral md:text-5xl">
                อัปเดตข่าวสาร สุขภาพ และภารกิจสำคัญจากทุกหน่วยงานในสังกัด
              </h1>
              <p className="max-w-2xl text-lg text-slate-600">
                ติดตามประกาศทางการ กิจกรรมประชาสัมพันธ์ และข้อมูลหน่วยงานสาธารณสุขได้ในหน้าเดียว
                พร้อมลิงก์ไปยังศูนย์ข้อมูลเชิงลึกสำหรับผู้ที่ต้องการศึกษารายละเอียดเพิ่มเติม
              </p>
              <ul className="grid gap-4 sm:grid-cols-2">
                <li className="rounded-3xl border border-white/70 bg-white/80 p-4 text-sm text-slate-600">
                  <span className="font-semibold text-primary">•</span> ข่าวด่วนและประกาศสำคัญจากทุกกรมกอง
                </li>
                <li className="rounded-3xl border border-white/70 bg-white/80 p-4 text-sm text-slate-600">
                  <span className="font-semibold text-primary">•</span> กิจกรรมส่งเสริมสุขภาพและการให้บริการในพื้นที่
                </li>
                <li className="rounded-3xl border border-white/70 bg-white/80 p-4 text-sm text-slate-600">
                  <span className="font-semibold text-primary">•</span> ภาพรวมโครงสร้างและบทบาทของหน่วยงานหลัก
                </li>
                <li className="rounded-3xl border border-white/70 bg-white/80 p-4 text-sm text-slate-600">
                  <span className="font-semibold text-primary">•</span> ช่องทางติดต่อและรับฟังความคิดเห็นจากประชาชน
                </li>
              </ul>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/news"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-neutral"
                >
                  อ่านข่าวทั้งหมด
                </Link>
                <Link
                  href="/structure"
                  className="rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
                >
                  ดูข้อมูลหน่วยงาน
                </Link>
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <div className="section-wrapper space-y-4 p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">ข่าวเด่นประจำวัน</p>
                {featuredNews ? (
                  <>
                    {featuredNews.image ? (
                      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
                        <Image
                          src={featuredNews.image}
                          alt={featuredNews.imageAlt ?? featuredNews.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 480px, 100vw"
                          priority
                        />
                      </div>
                    ) : null}
                    <p className="text-sm font-semibold text-neutral">{formatThaiDate(featuredNews.date)}</p>
                    <h2 className="text-xl font-semibold text-neutral">{featuredNews.title}</h2>
                    <p className="text-sm leading-6 text-slate-600">{featuredNews.summary}</p>
                    <Link
                      href={`/news/${featuredNews.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                    >
                      อ่านรายละเอียด <span aria-hidden="true">→</span>
                    </Link>
                  </>
                ) : (
                  <p className="text-sm text-slate-600">
                    ขณะนี้ยังไม่มีข่าวเด่น โปรดกลับมาตรวจสอบอีกครั้งในภายหลัง
                  </p>
                )}
              </div>
              {secondaryNews.length > 0 && (
                <div className="rounded-3xl border border-[#dcece2] bg-white/80 p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-neutral">อัปเดตอื่น ๆ</h3>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    {secondaryNews.map((newsItem) => (
                      <li key={newsItem.slug} className="flex items-start gap-4">
                        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                          {newsItem.image ? (
                            <Image
                              src={newsItem.image}
                              alt={newsItem.imageAlt ?? newsItem.title}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 text-[11px] font-semibold text-primary">
                              {(newsItem.title ?? 'ข่าวเด่น').slice(0, 20)}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                          <p className="text-xs text-primary/70">{formatThaiDate(newsItem.date)}</p>
                          <p className="font-medium text-neutral">{newsItem.title}</p>
                          <Link href={`/news/${newsItem.slug}`} className="text-xs font-semibold text-primary">
                            อ่านต่อ
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="section-wrapper overflow-hidden bg-white/85 p-10 shadow-sm">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
              <div className="flex-1 space-y-4">
                <SectionTitle
                  title="ข่าวและประกาศล่าสุด"
                  subtitle="สรุปสาระสำคัญจากทุกกรมในสังกัด พร้อมลิงก์ไปยังประกาศฉบับเต็ม"
                />
                <p className="text-sm text-slate-600">
                  อัปเดตนี้คัดเลือกข่าวที่ประชาชนควรทราบ เช่น นโยบายใหม่ มาตรการเร่งด่วน และคำเตือนด้านสุขภาพที่เกิดขึ้นในช่วงเวลานี้
                  สามารถดูประกาศย้อนหลังและตัวกรองหัวข้อได้ในหน้าศูนย์ข่าวเต็มรูปแบบ
                </p>
                <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  ไปยังศูนย์ข่าวทั้งหมด <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="flex-1 space-y-6">
                {latestAnnouncements.length > 0 ? (
                  latestAnnouncements.map((announcement) => (
                    <article
                      key={announcement.slug}
                      className="overflow-hidden rounded-3xl border border-[#dcece2] bg-white/90 shadow-sm transition hover:border-primary/60"
                    >
                      {announcement.image ? (
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <Image
                            src={announcement.image}
                            alt={announcement.imageAlt ?? announcement.title}
                            fill
                            className="object-cover"
                            sizes="(min-width: 1024px) 320px, 100vw"
                          />
                        </div>
                      ) : null}
                      <div className="p-6">
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">{formatThaiDate(announcement.date)}</p>
                        <h3 className="mt-3 text-lg font-semibold text-neutral">{announcement.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{announcement.summary}</p>
                        <Link href={`/announcements/${announcement.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                          อ่านประกาศฉบับเต็ม <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-[#dcece2] bg-white/70 p-6 text-sm text-slate-500">
                    ขณะนี้ยังไม่มีประกาศเผยแพร่ใหม่ ระบบจะแสดงรายการทันทีที่มีการอัปเดตเพิ่มเติม
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f4faf6] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-6">
                <SectionTitle
                  title="กิจกรรมและสื่อประชาสัมพันธ์"
                  subtitle="กระจายความรู้และบริการเชิงรุกไปยังพื้นที่ต่าง ๆ ทั่วประเทศ"
                />
                <p className="text-sm leading-6 text-slate-600">
                  เลือกติดตามกิจกรรมจากแต่ละศูนย์ เพื่อร่วมเข้ารับบริการ เช็กกำหนดการลงพื้นที่ หรือแชร์ข้อมูลให้กับชุมชนของท่านได้สะดวก
                </p>
              </div>
              <div className="rounded-3xl border border-[#c7e2d1] bg-[#eef7f1] p-6 text-sm text-slate-600">
                ศูนย์ปฏิบัติการประชาสัมพันธ์กลางประสานข้อมูลกับสำนักงานสาธารณสุขจังหวัดเพื่อให้ข่าวและกิจกรรมมีความถูกต้องทันเวลา
                หากต้องการจัดกิจกรรมร่วม โปรดติดต่อผ่านศูนย์บริการประชาชนหรือแบบฟอร์มออนไลน์
              </div>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {campaignHighlights.map((item) => (
                <div key={item.title} className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">{item.period}</p>
                  <h3 className="mt-2 text-lg font-semibold text-neutral">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                  <p className="mt-4 text-sm font-medium text-primary">พื้นที่ดำเนินการ: {item.location}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <SectionTitle
            title="ภาพรวมหน่วยงานในสังกัด"
            subtitle="รู้จักบทบาทหลักของกรมและสำนักต่าง ๆ เพื่อการประสานงานที่ถูกต้อง"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {agencyOverview.map((agency) => (
              <div key={agency.name} className="rounded-3xl border border-[#dcece2] bg-white/85 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-neutral">{agency.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{agency.summary}</p>
                <p className="mt-4 text-sm font-semibold text-primary">หัวข้อเน้น: {agency.focus}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/structure"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-neutral"
            >
              สำรวจโครงสร้างบุคลากรแบบเต็ม <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
            >
              ติดต่อหน่วยงานเฉพาะด้าน <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section className="bg-[#f4faf6] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <SectionTitle
              title="ช่องทางติดตามและรับข้อมูล"
              subtitle="เลือกวิธีรับข่าวสารที่สะดวก ไม่ว่าจะเป็นออนไลน์หรือศูนย์บริการใกล้บ้าน"
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {mediaChannels.map((channel) => (
                <Link
                  key={channel.href}
                  href={channel.href}
                  className="group flex h-full flex-col justify-between rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-neutral group-hover:text-primary">{channel.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{channel.description}</p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    ดูรายละเอียด <span aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
