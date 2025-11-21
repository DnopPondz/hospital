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
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white">
          {/* Abstract Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#e0f2fe,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_#f0fdfa,_transparent_50%)]" />

          <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-6 py-24 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-1.5 text-sm font-medium text-primary ring-1 ring-teal-100">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                ศูนย์ประชาสัมพันธ์กระทรวงสาธารณสุข
              </div>

              <h1 className="text-4xl font-bold text-neutral leading-tight lg:text-6xl">
                อัปเดตข่าวสาร สุขภาพ <br/>
                <span className="text-primary">และภารกิจสำคัญ</span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-slate-600">
                ติดตามประกาศทางการ กิจกรรมประชาสัมพันธ์ และข้อมูลหน่วยงานสาธารณสุขได้ในหน้าเดียว
                เชื่อมต่อข้อมูลภาครัฐเพื่อประชาชน
              </p>

              <div className="grid gap-4 sm:grid-cols-2 text-sm text-slate-600 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-secondary"></div>
                    <span>ข่าวด่วนและประกาศสำคัญ</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-secondary"></div>
                    <span>กิจกรรมส่งเสริมสุขภาพ</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-secondary"></div>
                    <span>ภาพรวมโครงสร้างหน่วยงาน</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-secondary"></div>
                    <span>ช่องทางติดต่อประชาชน</span>
                  </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/news"
                  className="rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-teal-800 hover:shadow-lg hover:-translate-y-0.5"
                >
                  อ่านข่าวทั้งหมด
                </Link>
                <Link
                  href="/structure"
                  className="rounded-lg border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-primary hover:text-primary hover:bg-slate-50"
                >
                  ดูข้อมูลหน่วยงาน
                </Link>
              </div>
            </div>

            <div className="flex-1 w-full max-w-lg lg:max-w-none">
              <div className="relative z-10 rounded-2xl border border-slate-100 bg-white p-1 shadow-xl ring-1 ring-slate-900/5">
                 <div className="rounded-xl bg-slate-50 p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="text-lg font-bold text-neutral flex items-center gap-2">
                         <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                         </svg>
                         ข่าวเด่นประจำวัน
                       </h3>
                       <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">Update Latest</span>
                    </div>

                    {featuredNews ? (
                      <div className="group cursor-pointer">
                        <div className="overflow-hidden rounded-xl bg-slate-200 aspect-video relative mb-5">
                             {/* Placeholder for image if available, or a pattern */}
                             <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary opacity-10"></div>
                             <div className="absolute inset-0 flex items-center justify-center text-primary/20">
                                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                             </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                           <span className="font-semibold text-primary">{formatThaiDate(featuredNews.date)}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                           <span>News</span>
                        </div>
                        <h2 className="text-xl font-bold text-neutral group-hover:text-primary transition-colors mb-3 line-clamp-2">
                          {featuredNews.title}
                        </h2>
                        <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                          {featuredNews.summary}
                        </p>
                        <Link
                          href={`/news/${featuredNews.slug}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-teal-800"
                        >
                          อ่านรายละเอียด <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                      </div>
                    ) : (
                       <div className="text-center py-10 text-slate-500 text-sm">ยังไม่มีข่าวเด่นในขณะนี้</div>
                    )}
                 </div>

                 {secondaryNews.length > 0 && (
                    <div className="border-t border-slate-100 p-6 sm:p-8 bg-white rounded-b-xl">
                       <div className="space-y-4">
                          {secondaryNews.map((newsItem) => (
                             <Link key={newsItem.slug} href={`/news/${newsItem.slug}`} className="flex gap-4 group">
                                <div className="shrink-0 w-16 h-16 rounded-lg bg-slate-100 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-slate-200 group-hover:bg-slate-300 transition-colors"></div>
                                </div>
                                <div>
                                   <div className="text-xs text-primary font-medium mb-1">{formatThaiDate(newsItem.date)}</div>
                                   <h4 className="text-sm font-semibold text-neutral group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                      {newsItem.title}
                                   </h4>
                                </div>
                             </Link>
                          ))}
                       </div>
                    </div>
                 )}
              </div>
            </div>
          </div>
        </section>

        {/* Latest Announcements */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-12">
             <SectionTitle
                title="ข่าวและประกาศล่าสุด"
                subtitle="สรุปสาระสำคัญจากทุกกรมในสังกัด พร้อมลิงก์ไปยังประกาศฉบับเต็ม"
              />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
              <div className="rounded-2xl bg-primary p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>

                 <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4">ประกาศสำคัญ</h3>
                    <p className="text-teal-100 leading-relaxed text-sm mb-8">
                       อัปเดตนี้คัดเลือกข่าวที่ประชาชนควรทราบ เช่น นโยบายใหม่ มาตรการเร่งด่วน และคำเตือนด้านสุขภาพ
                    </p>
                 </div>

                 <div className="relative z-10">
                   <Link href="/news" className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition hover:bg-teal-50 w-full">
                      ไปยังศูนย์ข่าวทั้งหมด
                   </Link>
                 </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {latestAnnouncements.length > 0 ? (
                  latestAnnouncements.map((announcement) => (
                    <article
                      key={announcement.slug}
                      className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
                    >
                      <div>
                        <span className="inline-block rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                          {formatThaiDate(announcement.date)}
                        </span>
                        <h3 className="mt-4 text-lg font-bold text-neutral group-hover:text-primary transition-colors line-clamp-2">
                          {announcement.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3">
                          {announcement.summary}
                        </p>
                      </div>
                      <Link
                        href={`/announcements/${announcement.slug}`}
                        className="mt-6 inline-flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform"
                      >
                        อ่านประกาศฉบับเต็ม <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </Link>
                    </article>
                  ))
                ) : (
                  <div className="col-span-2 flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-12 text-sm text-slate-500">
                    ขณะนี้ยังไม่มีประกาศเผยแพร่ใหม่
                  </div>
                )}
              </div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="bg-slate-100 py-24 border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
              <div>
                <SectionTitle
                  title="กิจกรรมและสื่อประชาสัมพันธ์"
                  subtitle="กระจายความรู้และบริการเชิงรุกไปยังพื้นที่ต่าง ๆ ทั่วประเทศ"
                />
                 <p className="mt-6 text-lg text-slate-600 max-w-xl">
                  เลือกติดตามกิจกรรมจากแต่ละศูนย์ เพื่อร่วมเข้ารับบริการ เช็กกำหนดการลงพื้นที่ หรือแชร์ข้อมูลให้กับชุมชนของท่านได้สะดวก
                </p>
              </div>
              <div className="flex items-center">
                  <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm relative">
                     <div className="absolute top-6 left-0 w-1 h-12 bg-secondary rounded-r"></div>
                     <h4 className="font-bold text-neutral mb-2">ศูนย์ปฏิบัติการประชาสัมพันธ์กลาง</h4>
                     <p className="text-sm text-slate-600 leading-relaxed">
                        ประสานข้อมูลกับสำนักงานสาธารณสุขจังหวัดเพื่อให้ข่าวและกิจกรรมมีความถูกต้องทันเวลา
                        หากต้องการจัดกิจกรรมร่วม โปรดติดต่อผ่านศูนย์บริการประชาชน
                     </p>
                  </div>
              </div>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {campaignHighlights.map((item, idx) => (
                <div key={item.title} className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="absolute top-0 right-0 bg-slate-100 rounded-bl-2xl px-4 py-2 text-xs font-bold text-slate-500">
                     0{idx + 1}
                  </div>
                  <div className="mb-4">
                     <span className="text-xs font-bold uppercase tracking-wider text-secondary">{item.period}</span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">{item.description}</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-lg">
                    <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {item.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Agency Overview */}
        <section className="mx-auto max-w-7xl px-6 py-24">
           <div className="text-center max-w-3xl mx-auto mb-16">
              <SectionTitle
                title="ภาพรวมหน่วยงานในสังกัด"
                subtitle="รู้จักบทบาทหลักของกรมและสำนักต่าง ๆ เพื่อการประสานงานที่ถูกต้อง"
              />
           </div>

          <div className="grid gap-6 md:grid-cols-2">
            {agencyOverview.map((agency) => (
              <div key={agency.name} className="flex flex-col sm:flex-row gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
                <div className="shrink-0">
                   <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-primary">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                   </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral">{agency.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{agency.summary}</p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-100">
                     <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                     {agency.focus}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center gap-4">
            <Link
              href="/structure"
              className="rounded-lg bg-neutral px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-slate-700"
            >
              สำรวจโครงสร้างบุคลากร
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              ติดต่อหน่วยงาน
            </Link>
          </div>
        </section>

        {/* Channels */}
        <section className="bg-primary py-24 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')]"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          <div className="mx-auto max-w-7xl px-6 relative z-10">
             <div className="mb-12">
                <h2 className="text-3xl font-bold">ช่องทางติดตามและรับข้อมูล</h2>
                <p className="mt-4 text-teal-100 max-w-2xl text-lg">เลือกวิธีรับข่าวสารที่สะดวก ไม่ว่าจะเป็นออนไลน์หรือศูนย์บริการใกล้บ้าน เพื่อไม่พลาดสิทธิประโยชน์สำคัญ</p>
             </div>

            <div className="grid gap-6 md:grid-cols-3">
              {mediaChannels.map((channel) => (
                <Link
                  key={channel.href}
                  href={channel.href}
                  className="group flex flex-col justify-between rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-8 transition hover:bg-white/15 hover:-translate-y-1"
                >
                  <div>
                    <h3 className="text-xl font-bold text-white">{channel.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-teal-50 opacity-90">{channel.description}</p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-accent group-hover:text-white transition-colors">
                    ดูรายละเอียด <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
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
