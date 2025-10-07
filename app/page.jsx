import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
import ServiceCard from '@/components/ServiceCard';
import StatCard from '@/components/StatCard';

const services = [
  {
    icon: '🪪',
    title: 'บริการบัตรประชาชน',
    description: 'จองคิวทำบัตรใหม่ แจ้งเปลี่ยนแปลงข้อมูล และตรวจสอบสถานะได้ภายในไม่กี่คลิก',
    link: '#'
  },
  {
    icon: '💼',
    title: 'สิทธิและสวัสดิการ',
    description: 'ตรวจสอบสิทธิประโยชน์และสมัครรับสวัสดิการจากทุกหน่วยงานในที่เดียว',
    link: '#'
  },
  {
    icon: '🏥',
    title: 'บริการด้านสาธารณสุข',
    description: 'จองคิวโรงพยาบาล ค้นหาแพทย์เฉพาะทาง และดูประวัติการรักษาออนไลน์',
    link: '#'
  },
  {
    icon: '📄',
    title: 'ยื่นคำร้องออนไลน์',
    description: 'ยื่นคำขอเอกสารราชการและติดตามความคืบหน้าแบบเรียลไทม์',
    link: '#'
  }
];

const announcements = [
  {
    title: 'ประกาศมาตรการบริการประชาชนเชิงรุกประจำปี 2567',
    date: '15 พฤษภาคม 2567',
    body: 'ปรับปรุงขั้นตอนบริการและเพิ่มช่องทางออนไลน์เพื่อให้ประชาชนเข้าถึงได้ทุกที่'
  },
  {
    title: 'เปิดตัวแพลตฟอร์มดิจิทัลใหม่ "ThaiGov Connect"',
    date: '2 พฤษภาคม 2567',
    body: 'รวมบริการของหน่วยงานภาครัฐกว่า 200 บริการไว้ในช่องทางเดียว พร้อมระบบ Single Sign-on'
  },
  {
    title: 'แจ้งเตือนประชาชนระวังมิจฉาชีพแอบอ้างชื่อหน่วยงาน',
    date: '25 เมษายน 2567',
    body: 'หน่วยงานไม่มีการขอข้อมูลส่วนตัวผ่านโทรศัพท์ โปรดตรวจสอบทุกครั้งก่อนให้ข้อมูล'
  }
];

const stats = [
  { value: '2.8M+', label: 'บัญชีประชาชนที่ใช้งานระบบ' },
  { value: '180+', label: 'บริการภาครัฐที่เชื่อมต่อ' },
  { value: '98%', label: 'ความพึงพอใจจากแบบสำรวจล่าสุด' }
];

const digitalServices = [
  {
    title: 'ศูนย์รวมการแจ้งเตือน',
    description: 'รับการแจ้งเตือนสําคัญจากทุกหน่วยงานผ่านศูนย์เดียว และตั้งค่าความถี่ได้ตามต้องการ'
  },
  {
    title: 'แดชบอร์ดส่วนบุคคล',
    description: 'ติดตามสถานะคำร้อง เอกสารที่ต้องต่ออายุ และข่าวสารเฉพาะกลุ่ม'
  },
  {
    title: 'ผู้ช่วยอัจฉริยะภาครัฐ',
    description: 'ตอบคำถามและแนะนำบริการที่เหมาะสมผ่านระบบสนทนาด้วยภาษาไทย'
  }
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-100">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(77,166,255,0.25),_transparent_55%)]" />
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
                <a href="#digital" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-neutral">
                  เริ่มต้นใช้งานบริการดิจิทัล
                </a>
                <a href="#services" className="rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10">
                  สำรวจบริการทั้งหมด
                </a>
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
                  <li className="flex items-center justify-between rounded-2xl bg-sky-50/60 px-4 py-3">
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

        <section id="services" className="mx-auto max-w-6xl px-6 py-20">
          <SectionTitle title="บริการยอดนิยม" subtitle="เชื่อมต่อบริการที่จำเป็นสำหรับทุกช่วงชีวิตให้พร้อมใช้งานในไม่กี่ขั้นตอน" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </section>

        <section id="news" className="mx-auto max-w-6xl px-6 pb-20">
          <div className="section-wrapper p-10">
            <SectionTitle title="ข่าวประกาศล่าสุด" subtitle="ติดตามนโยบายและประกาศสำคัญจากภาครัฐ" />
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {announcements.map((announcement) => (
                <article key={announcement.title} className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">{announcement.date}</p>
                  <h3 className="mt-3 text-lg font-semibold text-neutral">{announcement.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{announcement.body}</p>
                  <a href="#" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    อ่านเพิ่มเติม <span aria-hidden="true">→</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="digital" className="mx-auto max-w-6xl px-6 pb-20">
          <div className="section-wrapper grid gap-12 p-10 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-6">
              <SectionTitle
                title="ศูนย์บริการดิจิทัล ThaiGov Connect"
                subtitle="เข้าสู่ระบบเดียว ใช้บริการได้ทุกหน่วยงาน พร้อมผู้ช่วยอัจฉริยะดูแลคุณตลอด 24 ชั่วโมง"
              />
              <div className="grid gap-6 md:grid-cols-2">
                {digitalServices.map((service) => (
                  <div key={service.title} className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm">
                    <h3 className="text-base font-semibold text-neutral">{service.title}</h3>
                    <p className="mt-3 text-sm text-slate-600">{service.description}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-primary to-accent p-8 text-white">
                <h3 className="text-lg font-semibold">ลงทะเบียนใช้งานภายในไม่กี่นาที</h3>
                <p className="mt-3 text-sm text-sky-50">เข้าสู่ระบบด้วยบัตรประชาชนหรือบัญชีภาครัฐเดิมที่มีอยู่</p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <a href="#" className="rounded-full bg-white/90 px-6 py-3 text-sm font-semibold text-primary transition hover:bg-white">
                    ลงทะเบียนบัญชีใหม่
                  </a>
                  <a href="#" className="rounded-full border border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                    คู่มือการใช้งาน
                  </a>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-sm">
                <h3 className="text-base font-semibold text-neutral">ช่องทางด่วน</h3>
                <ul className="mt-5 space-y-4 text-sm text-slate-600">
                  <li className="flex items-center justify-between">
                    <span>ลงชื่อเข้าใช้ด้วยบัตรประชาชน</span>
                    <span className="text-primary">→</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>ยืนยันตัวตนผ่านแอป ThaID</span>
                    <span className="text-primary">→</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>ติดตามสถานะคำร้อง</span>
                    <span className="text-primary">→</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>ขอรับการแจ้งเตือนเพิ่มเติม</span>
                    <span className="text-primary">→</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-3xl border border-sky-200 bg-sky-50/80 p-8 text-neutral">
                <h3 className="text-base font-semibold text-neutral">มาตรฐานความปลอดภัย</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  ระบบรักษาความปลอดภัยระดับสากล รองรับการยืนยันตัวตนหลายปัจจัยและการเข้ารหัสข้อมูลทุกขั้นตอน เพื่อปกป้องข้อมูลส่วนบุคคลของประชาชน
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-6xl px-6 pb-20">
          <div className="section-wrapper grid gap-12 p-10 lg:grid-cols-2">
            <div className="space-y-6">
              <SectionTitle title="ติดต่อศูนย์บริการภาครัฐ" subtitle="พร้อมดูแลประชาชนทุกช่องทาง" />
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm">
                  <p className="text-sm font-semibold text-neutral">สายด่วนภาครัฐ 1111</p>
                  <p className="mt-2 text-sm text-slate-600">24 ชั่วโมง</p>
                </div>
                <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm">
                  <p className="text-sm font-semibold text-neutral">ศูนย์บริการประชาชน</p>
                  <p className="mt-2 text-sm text-slate-600">อาคารราชการไทย ถนนประชาธิปไตย เขตดุสิต กรุงเทพฯ</p>
                </div>
                <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm">
                  <p className="text-sm font-semibold text-neutral">บริการสนทนาออนไลน์</p>
                  <p className="mt-2 text-sm text-slate-600">จันทร์-ศุกร์ 08:30 - 20:00 น.</p>
                </div>
                <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm">
                  <p className="text-sm font-semibold text-neutral">ศูนย์ข้อมูลเปิด</p>
                  <p className="mt-2 text-sm text-slate-600">ดาวน์โหลดชุดข้อมูลภาครัฐพร้อมใช้งาน</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-sm">
                <h3 className="text-base font-semibold text-neutral">แบบฟอร์มติดต่อออนไลน์</h3>
                <form className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral" htmlFor="fullname">
                      ชื่อ-นามสกุล
                    </label>
                    <input
                      id="fullname"
                      type="text"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-neutral focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="กรอกชื่อ-นามสกุล"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral" htmlFor="email">
                      อีเมล
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-neutral focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral" htmlFor="message">
                      ข้อความ
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-neutral focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="ระบุรายละเอียดที่ต้องการติดต่อ"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-neutral"
                  >
                    ส่งข้อความ
                  </button>
                </form>
              </div>
              <div className="rounded-3xl border border-sky-200 bg-sky-50/80 p-8 text-sm text-slate-600">
                <p>
                  *ข้อมูลทุกอย่างจะถูกจัดเก็บตามมาตรฐาน PDPA และใช้เพื่อการให้บริการตามที่ระบุเท่านั้น สามารถตรวจสอบนโยบายความเป็นส่วนตัวได้ที่ศูนย์ข้อมูลเปิด
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
