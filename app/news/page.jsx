import Link from 'next/link';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
import NewsExplorer from '@/components/news/NewsExplorer';
import { getNews } from '@/lib/news';
import { formatThaiDate } from '@/lib/news-helpers';

const focusAreas = [
  {
    title: 'นโยบายและยุทธศาสตร์',
    description: 'สรุปการประชุมสำคัญ พร้อมไทม์ไลน์และไฟล์แนบ เพื่อส่งต่อให้หน่วยงานในภูมิภาค'
  },
  {
    title: 'โครงการและสิทธิประโยชน์',
    description: 'ติดตามรอบเปิดรับสมัคร แจ้งเงื่อนไขสำคัญ และสรุปกลุ่มเป้าหมายที่เกี่ยวข้อง'
  },
  {
    title: 'ประกาศเร่งด่วน',
    description: 'เตรียมชุดข้อมูลฉุกเฉิน พร้อมป้ายแจ้งเตือนระดับเร่งด่วนสำหรับเผยแพร่หลายช่องทาง'
  }
];

export default async function NewsPage() {
  const newsItems = await getNews();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#e8f5ee] via-white to-[#d2e6da]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(104,194,139,0.18),_transparent_55%)]" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-primary shadow-sm">
                <span className="h-2 w-2 rounded-full bg-primary" />
                ศูนย์ข่าวและประกาศราชการ
              </span>
              <h1 className="text-3xl font-semibold text-neutral md:text-5xl">
                อัปเดตข่าวสารภาครัฐแบบไทม์ไลน์เดียว ครบทุกกรมกอง
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                รวบรวมประกาศสำคัญ นโยบายใหม่ และแจ้งเตือนเร่งด่วน พร้อมตัวกรองค้นหาแบบเรียลไทม์ เพื่อให้ทีมประชาสัมพันธ์และประชาชนเข้าถึงข้อมูลได้ตรงตามความสนใจ
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {focusAreas.map((item) => (
                  <div key={item.title} className="rounded-3xl border border-[#dcece2] bg-white/80 p-5 shadow-sm">
                    <h3 className="text-base font-semibold text-neutral">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="section-wrapper space-y-6 p-8">
                <h2 className="text-lg font-semibold text-neutral">ข่าวเด่นประจำวัน</h2>
                <ul className="space-y-4 text-sm text-slate-600">
                  {newsItems.slice(0, 4).map((newsItem) => (
                    <li key={newsItem.slug} className="flex flex-col rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm">
                      <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                        {formatThaiDate(newsItem.date)}
                      </span>
                      <Link href={`/news/${newsItem.slug}`} className="mt-1 text-sm font-semibold text-neutral hover:text-primary">
                        {newsItem.title}
                      </Link>
                      <span className="mt-2 text-xs text-slate-500">{newsItem.summary}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <NewsExplorer newsItems={newsItems} />

        <section className="bg-[#f4faf6] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
              <div className="space-y-4">
                <SectionTitle
                  title="เครื่องมือค้นข่าว"
                  subtitle="จำกัดผลลัพธ์ตามหมวด จังหวัด ระดับความสำคัญ และแท็ก พร้อมสรุปสถิติการเข้าถึงเพื่อวางแผนประชาสัมพันธ์"
                />
                <p className="text-sm leading-6 text-slate-600">
                  ส่วนควบคุมด้านซ้ายสามารถบันทึกค่าตัวกรองที่ใช้บ่อย เพื่อช่วยให้ทีมส่วนกลางส่งต่อข่าวให้หน่วยงานจังหวัดหรืออำเภอได้รวดเร็วขึ้น พร้อมระบุระดับความสำคัญสำหรับสื่อแต่ละช่องทาง
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  ข้อมูลที่กรองแล้วสามารถดาวน์โหลดเป็นไฟล์ CSV หรือแชร์ลิงก์การค้นหาไปยังกลุ่มปฏิบัติงานผ่านระบบอินทราเน็ตเพื่อทำงานร่วมกันได้สะดวก (ฟีเจอร์กำลังพัฒนา)
                </p>
              </div>
              <div className="section-wrapper space-y-6 p-8">
                <h3 className="text-base font-semibold text-neutral">กำลังพัฒนา</h3>
                <ul className="space-y-4 text-sm leading-6 text-slate-600">
                  <li className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm">
                    แดชบอร์ดแสดงนโยบายที่เกี่ยวข้องกับคุณ พร้อมการแจ้งเตือนผ่านแอป ThaiGov Connect
                  </li>
                  <li className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm">
                    สรุปประเด็นสำคัญจากการประชุม ครม. ในรูปแบบอินโฟกราฟิกอ่านง่ายภายใน 3 นาที
                  </li>
                  <li className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm">
                    การแจ้งเตือนเฉพาะพื้นที่ เพื่อให้ประชาชนรับรู้ประกาศสำคัญในจังหวัดของตนทันที
                  </li>
                </ul>
                <div className="rounded-3xl border border-[#c7e2d1] bg-[#eef7f1] p-6 text-sm text-slate-600">
                  ต้องการส่งข่าวจากหน่วยงานของท่าน? ติดต่อศูนย์ประสานงานข่าวประชาสัมพันธ์ได้ที่อีเมล info@moph.go.th
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
