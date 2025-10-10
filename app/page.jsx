import Link from 'next/link';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
import ServiceCard from '@/components/ServiceCard';
import StatCard from '@/components/StatCard';
import { getAnnouncements } from '@/lib/announcements';
import { coreServices } from '@/lib/services';

const stats = [
  { value: '2.8M+', label: 'บัญชีประชาชนที่ใช้งานระบบ' },
  { value: '180+', label: 'บริการภาครัฐที่เชื่อมต่อ' },
  { value: '98%', label: 'ความพึงพอใจจากแบบสำรวจล่าสุด' }
];

const quickDestinations = [
  {
    title: 'บริการดิจิทัลสำหรับประชาชน',
    description: 'เลือกบริการที่ต้องการตามสถานการณ์ชีวิต พร้อมระบบนัดหมายล่วงหน้า',
    href: '/services'
  },
  {
    title: 'สรุปข่าวและประกาศสำคัญ',
    description: 'ติดตามนโยบายใหม่และประกาศเร่งด่วนจากทุกกรมกองในมุมมองเดียว',
    href: '/news'
  },
  {
    title: 'ศูนย์บริการ ThaiGov Connect',
    description: 'ลงทะเบียนบัญชี สั่งงานดิจิทัล และตั้งค่าการแจ้งเตือนแบบรวมศูนย์',
    href: '/digital'
  },
  {
    title: 'ช่องทางติดต่อภาครัฐ',
    description: 'จองเวลาพบเจ้าหน้าที่ ส่งคำร้องออนไลน์ หรือขอคำปรึกษาเฉพาะด้าน',
    href: '/contact'
  }
];

const digitalPreview = [
  {
    title: 'แดชบอร์ดสถานะคำร้อง',
    description: 'เห็นความคืบหน้าเอกสารทุกฉบับ พร้อมเวลาประเมินการอนุมัติแบบเรียลไทม์'
  },
  {
    title: 'ผู้ช่วยระบบอัตโนมัติ',
    description: 'สนทนาเป็นภาษาไทย แนะนำขั้นตอนและเอกสารที่ต้องเตรียมได้ทันที'
  },
  {
    title: 'การยืนยันตัวตนปลอดภัย',
    description: 'รองรับทั้งบัตรประชาชน สแกนใบหน้า และแอป ThaID เพื่อความสบายใจ'
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
  const announcements = (await getAnnouncements()).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#e9f5ee] via-white to-[#cfe7d7]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(104,194,139,0.22),_transparent_55%)]" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20 md:flex-row md:items-center">
            <div className="flex-1 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-primary shadow-sm">
                <span className="h-2 w-2 rounded-full bg-primary" />
                ระบบบริการดิจิทัลภาครัฐ
              </span>
              <h1 className="text-3xl font-semibold text-neutral md:text-5xl">
                พร้อมดูแลทุกเรื่องราชการ ในช่องทางที่ประชาชนเข้าถึงได้ง่ายที่สุด
              </h1>
              <p className="max-w-xl text-lg text-slate-600">
                รวมข้อมูลและบริการจากทุกหน่วยงานภาครัฐไว้ในที่เดียว ตั้งแต่การขอเอกสาร จองคิว ไปจนถึงรับสิทธิประโยชน์ต่าง ๆ บริการด้วยมาตรฐานเดียวกันทั่วประเทศ
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/digital"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-neutral"
                >
                  เริ่มต้นใช้งานบริการดิจิทัล
                </Link>
                <Link
                  href="/services"
                  className="rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
                >
                  สำรวจบริการทั้งหมด
                </Link>
              </div>
              <div className="grid gap-4 pt-8 sm:grid-cols-3">
                {stats.map((item) => (
                  <StatCard key={item.label} value={item.value} label={item.label} />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="section-wrapper space-y-5 p-8">
                <h2 className="text-lg font-semibold text-neutral">บริการด่วนยอดนิยม</h2>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center justify-between rounded-2xl bg-[#e6f4ec] px-4 py-3">
                    <span>ตรวจสอบสิทธิ "เราชนะ" รอบล่าสุด</span>
                    <span className="text-primary">→</span>
                  </li>
                  <li className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <span>ติดตามสถานะคำขอหนังสือรับรอง</span>
                    <span className="text-primary">→</span>
                  </li>
                  <li className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <span>ยื่นภาษีบุคคลธรรมดาออนไลน์</span>
                    <span className="text-primary">→</span>
                  </li>
                  <li className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <span>ตรวจสอบสิทธิประกันสังคม</span>
                    <span className="text-primary">→</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <SectionTitle title="เมนูสำหรับงานราชการ" subtitle="เลือกปลายทางที่ต้องการแล้วเริ่มต้นในหน้าที่ออกแบบมาเฉพาะ" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {quickDestinations.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex h-full flex-col justify-between rounded-3xl border border-[#dcece2] bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg"
              >
                <div>
                  <h3 className="text-lg font-semibold text-neutral group-hover:text-primary">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  ไปยังหน้าเฉพาะทาง <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-[#f3fbf6] via-white to-[#e1f2e7] py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(104,194,139,0.18),_transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
              <div className="flex-1 space-y-6">
                <SectionTitle
                  title="บริการหลักสำหรับประชาชน"
                  subtitle="ตัวอย่างบริการที่ได้รับความนิยมสูงสุด พร้อมลิงก์สู่รายละเอียดเชิงลึก"
                />
                <p className="text-sm text-slate-600">
                  เลือกดูบริการตามหมวดหมู่หรือค้นหาเหตุการณ์ที่ตรงกับคุณได้ในหน้า{' '}
                  <span className="font-semibold text-primary">บริการประชาชน</span> ซึ่งมีคู่มือ ภาพรวมขั้นตอน และคำถามที่พบบ่อยแยกตามงาน
                  เพื่อช่วยให้การดำเนินการรวดเร็วและมั่นใจยิ่งขึ้น
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  เปิดดูบริการทั้งหมด <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="flex-1">
                <div className="grid gap-6 md:grid-cols-2">
                  {coreServices.slice(0, 4).map((service) => (
                    <ServiceCard key={service.title} {...service} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="section-wrapper overflow-hidden bg-white/85 p-10 shadow-sm">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
              <div className="flex-1 space-y-4">
                <SectionTitle
                  title="ข่าวและประกาศล่าสุด"
                  subtitle="สรุปประเด็นสำคัญที่ต้องรู้ และเชื่อมต่อไปยังศูนย์ข่าวเต็มรูปแบบ"
                />
                <p className="text-sm text-slate-600">
                  หน้า<span className="font-semibold text-primary">ข่าวประกาศ</span> รวบรวมข้อมูลจากทุกกรมกองพร้อมตัวกรองตามหมวด และไทม์ไลน์เหตุการณ์ย้อนหลังเพื่อให้ติดตามได้สะดวก
                  ตัวอย่างข่าวที่เผยแพร่ล่าสุดมีดังนี้
                </p>
                <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  ไปยังศูนย์ข่าวทั้งหมด <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="flex-1 space-y-6">
                {announcements.map((announcement) => (
                  <article
                    key={announcement.slug}
                    className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm transition hover:border-primary/60"
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">{formatThaiDate(announcement.date)}</p>
                    <h3 className="mt-3 text-lg font-semibold text-neutral">{announcement.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{announcement.summary}</p>
                    <Link href={`/announcements/${announcement.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      อ่านประกาศฉบับเต็ม <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f4faf6] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-6">
                <SectionTitle title="ThaiGov Connect" subtitle="ศูนย์กลางการทำงานดิจิทัลของภาครัฐ" />
                <p className="text-sm leading-6 text-slate-600">
                  ศูนย์บริการดิจิทัลออกแบบให้เชื่อมโยงงานทุกประเภทของประชาชน ตั้งแต่การเข้าระบบ ไปจนถึงการรับการแจ้งเตือนเฉพาะเรื่อง
                  หน้าศูนย์บริการฯ จะแสดงแผนที่การเดินเรื่อง การตั้งค่าบัญชี และคู่มือการใช้งานเชิงลึกแบบก้าวต่อก้าว
                </p>
                <ul className="space-y-4">
                  {digitalPreview.map((item) => (
                    <li key={item.title} className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm">
                      <h3 className="text-base font-semibold text-neutral">{item.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/digital"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-neutral"
                >
                  สำรวจศูนย์บริการดิจิทัล <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="section-wrapper space-y-6 p-8">
                <h3 className="text-base font-semibold text-neutral">ขั้นตอนเริ่มใช้งาน</h3>
                <ol className="space-y-4 text-sm text-slate-600">
                  <li className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-sm">
                    <span className="font-semibold text-primary">1.</span> ยืนยันตัวตนด้วยบัตรประชาชนหรือแอป ThaID และสร้างบัญชี ThaiGov Connect
                  </li>
                  <li className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-sm">
                    <span className="font-semibold text-primary">2.</span> เลือกบริการที่ต้องการ พร้อมตั้งค่าการแจ้งเตือนและผูกเอกสารสำคัญ
                  </li>
                  <li className="rounded-3xl border border-white/60 bg-white/80 p-4 shadow-sm">
                    <span className="font-semibold text-primary">3.</span> ติดตามสถานะและรับคำแนะนำจากผู้ช่วยอัจฉริยะได้ตลอด 24 ชั่วโมง
                  </li>
                </ol>
                <div className="rounded-3xl border border-[#c7e2d1] bg-[#eef7f1] p-6 text-sm text-slate-600">
                  รองรับการใช้งานบนคอมพิวเตอร์ โทรศัพท์มือถือ และศูนย์บริการภาครัฐทั่วประเทศ
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="section-wrapper grid gap-10 p-10 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-4">
              <SectionTitle
                title="ต้องการความช่วยเหลือเพิ่มเติม?"
                subtitle={
                  <>
                    หน้า<span className="font-semibold text-primary">ติดต่อเรา</span> พร้อมข้อมูลสายด่วน ช่องทางดิจิทัล และการจองเวลาเข้าพบเจ้าหน้าที่
                  </>
                }
              />
              <p className="text-sm text-slate-600">
                เลือกจองเวลาติดต่อ กรอกแบบฟอร์มออนไลน์ หรือดูแผนที่สำนักงานราชการได้จากหน้าเฉพาะโดยตรง พร้อมคำถามที่พบบ่อยแยกตามหัวข้อยอดนิยม
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                เปิดหน้าติดต่อเรา <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm">
                <p className="text-sm font-semibold text-neutral">สายด่วนภาครัฐ 1111</p>
                <p className="mt-2 text-sm text-slate-600">ตลอด 24 ชั่วโมง</p>
              </div>
              <div className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm">
                <p className="text-sm font-semibold text-neutral">บริการสนทนาออนไลน์</p>
                <p className="mt-2 text-sm text-slate-600">พร้อมเจ้าหน้าที่ตอบกลับภายใน 15 นาที</p>
              </div>
              <div className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm">
                <p className="text-sm font-semibold text-neutral">ศูนย์บริการประชาชน</p>
                <p className="mt-2 text-sm text-slate-600">อาคารราชการไทย ถนนประชาธิปไตย เขตดุสิต กรุงเทพฯ</p>
              </div>
              <div className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm">
                <p className="text-sm font-semibold text-neutral">ศูนย์ข้อมูลเปิด</p>
                <p className="mt-2 text-sm text-slate-600">ดาวน์โหลดเอกสารและนโยบายล่าสุดได้ทันที</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
