import Link from 'next/link';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
import { getNews } from '@/lib/news';

const focusAreas = [
  { title: 'นโยบายและยุทธศาสตร์', description: 'สรุปการประชุมและทิศทางสำคัญจากกระทรวงและหน่วยงานส่วนกลาง' },
  { title: 'โครงการและสิทธิประโยชน์', description: 'เปิดรับสมัครและแจ้งเตือนรอบใหม่ของโครงการช่วยเหลือประชาชน' },
  { title: 'ประกาศเร่งด่วน', description: 'แจ้งเตือนภัยพิบัติ การปิดปรับปรุงระบบ และประกาศพิเศษที่ต้องทราบทันที' }
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

function groupByMonth(newsItems) {
  return newsItems.reduce((groups, newsItem) => {
    const date = new Date(newsItem.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!groups[key]) {
      groups[key] = { month: date.toLocaleString('th-TH', { month: 'long', year: 'numeric' }), items: [] };
    }
    groups[key].items.push(newsItem);
    return groups;
  }, {});
}

export default async function NewsPage() {
  const newsItems = await getNews();
  const grouped = groupByMonth(newsItems);
  const monthKeys = Object.keys(grouped).sort((a, b) => (a > b ? -1 : 1));

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
                รวบรวมประกาศสำคัญ นโยบายใหม่ และแจ้งเตือนเร่งด่วน พร้อมเครื่องมือค้นหาและกรองข่าวตามหมวด หมายกำหนดการ และพื้นที่จังหวัด
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
                      <span className="mt-1 text-sm font-semibold text-neutral">{newsItem.title}</span>
                      <span className="mt-2 text-xs text-slate-500">{newsItem.summary}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <SectionTitle
            title="คลังข่าวทั้งหมด"
            subtitle="เรียงตามเดือนและสามารถค้นหาย้อนหลังได้ง่าย พร้อมข้อมูลสรุปให้อ่านเร็ว"
          />
          <div className="mt-12 space-y-10">
            {monthKeys.map((key) => (
              <div key={key} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-neutral">{grouped[key].month}</h2>
                  <span className="text-sm text-primary/80">ข่าวทั้งหมด {grouped[key].items.length} เรื่อง</span>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                  {grouped[key].items.map((newsItem) => (
                    <article key={newsItem.slug} className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                        {formatThaiDate(newsItem.date)}
                      </p>
                      <h3 className="mt-3 text-lg font-semibold text-neutral">{newsItem.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{newsItem.summary}</p>
                      <Link
                        href={`/news/${newsItem.slug}`}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                      >
                        อ่านรายละเอียดเพิ่มเติม <span aria-hidden="true">→</span>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#f4faf6] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
              <div className="space-y-4">
                <SectionTitle
                  title="เครื่องมือค้นข่าว"
                  subtitle="จำกัดผลลัพธ์ตามหมวด จังหวัด และระดับความสำคัญ เพื่อให้เจอข้อมูลที่ต้องการในไม่กี่วินาที"
                />
                <p className="text-sm leading-6 text-slate-600">
                  ระบบค้นหาจะมีตัวกรองอัตโนมัติตามแท็กที่หน่วยงานส่งเข้ามา เช่น นโยบาย โครงการ หรือประกาศเร่งด่วน พร้อมบันทึกการค้นหาที่ใช้บ่อยเพื่อเรียกใช้อีกครั้งได้ทันที
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  สำหรับข้อมูลเชิงลึก สามารถดาวน์โหลดไฟล์สรุปหรือสตรีมการแถลงข่าวย้อนหลังได้จากคลังมัลติมีเดียในหน้าเดียวกัน
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
