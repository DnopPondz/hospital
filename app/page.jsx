import Link from 'next/link';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
import ServiceCard from '@/components/ServiceCard';
import StatCard from '@/components/StatCard';
import ContactForm from '@/components/ContactForm';
import { getAnnouncements } from '@/lib/announcements';

const services = [
  {
    icon: '🪪',
    title: 'บริการบัตรประชาชน',
    description: 'จองคิวทำบัตรใหม่ แจ้งเปลี่ยนแปลงข้อมูล และตรวจสอบสถานะได้ภายในไม่กี่คลิก',
    link: '#',
    details: {
      paragraphs: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer gravida molestie mauris, eget mattis velit mattis vitae. Vivamus vehicula, turpis non aliquam pellentesque, urna tellus ornare erat, vitae dictum orci lectus eget metus. Sed at sodales nulla. Maecenas pellentesque vitae neque vitae ultrices. Donec efficitur, sapien at lobortis fermentum, orci arcu semper justo, vitae vulputate justo orci condimentum turpis.',
        'Suspendisse tempor arcu ut nisi viverra, vel vehicula nisl fringilla. Duis sed varius nisl. Sed tincidunt tristique purus sed dignissim. Nulla ullamcorper tincidunt erat, nec bibendum erat rhoncus a. Curabitur tincidunt, orci sit amet auctor ultricies, turpis est gravida erat, posuere varius metus velit in elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer ac ligula venenatis, tempus orci ac, faucibus lorem.',
        'Mauris finibus placerat nisi, vitae consequat magna commodo non. Curabitur sed fringilla odio, vitae ultricies quam. Vivamus euismod dapibus eros, id sollicitudin enim tincidunt viverra. Integer suscipit, enim ac ultrices tristique, ligula mi lacinia arcu, a vulputate eros arcu id nisi. Cras feugiat scelerisque felis eu tincidunt.'
      ],
      highlights: [
        'ขั้นตอนการยื่นคำร้องและจองคิวออนไลน์ภายใน 5 นาที',
        'ระบบติดตามสถานะแบบเรียลไทม์พร้อมแจ้งเตือนผ่านอีเมลและ SMS',
        'คำแนะนำการเตรียมเอกสารสำหรับกรณีบัตรหายหรือบัตรหมดอายุ'
      ],
      footer:
        'Nam consequat, neque a rutrum commodo, magna arcu suscipit ipsum, id efficitur eros risus ac enim. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.'
    }
  },
  {
    icon: '💼',
    title: 'สิทธิและสวัสดิการ',
    description: 'ตรวจสอบสิทธิประโยชน์และสมัครรับสวัสดิการจากทุกหน่วยงานในที่เดียว',
    link: '#',
    details: {
      paragraphs: [
        'Praesent posuere nunc id pretium euismod. Integer a ligula risus. Integer ac lacus a turpis aliquam tempus quis vel nisi. Morbi eu nibh non dolor tincidunt lobortis. Nulla ultricies libero sed iaculis bibendum. Nunc finibus quam libero, sed malesuada augue condimentum ut. Vestibulum id mauris varius, vehicula enim vitae, accumsan lacus.',
        'Aliquam erat volutpat. Donec quis tincidunt dui. Duis varius risus ac odio tincidunt tristique. Pellentesque vel sapien a augue interdum viverra vel eget libero. Vivamus mollis leo eget tellus volutpat blandit. Pellentesque egestas orci vitae varius feugiat. In luctus tortor at laoreet egestas. Nunc aliquet iaculis sapien, sed efficitur lacus iaculis sed.',
        'Donec aliquet, risus luctus euismod consequat, massa mi tincidunt erat, eu porta libero magna sed enim. Duis sit amet dolor vehicula, euismod risus non, varius elit. Duis vehicula lacus sed auctor sodales. Etiam sit amet ipsum neque. Integer gravida nibh sit amet odio blandit, porta semper leo egestas.'
      ],
      highlights: [
        'คู่มือเปรียบเทียบสิทธิจากหน่วยงานหลักกว่า 20 แห่ง',
        'ตัวช่วยกรอกแบบฟอร์มพร้อมบันทึกเวอร์ชันร่างอัตโนมัติ',
        'เทมเพลตคำถามที่พบบ่อยเพื่อเตรียมข้อมูลล่วงหน้า'
      ],
      footer:
        'Etiam tincidunt lectus id tortor mattis, vitae ullamcorper libero hendrerit. Nunc vitae laoreet lacus, eu interdum urna.'
    }
  },
  {
    icon: '🏥',
    title: 'บริการด้านสาธารณสุข',
    description: 'จองคิวโรงพยาบาล ค้นหาแพทย์เฉพาะทาง และดูประวัติการรักษาออนไลน์',
    link: '#',
    details: {
      paragraphs: [
        'Integer nec mauris in nisl pharetra hendrerit. Sed auctor nibh odio, at scelerisque ligula vestibulum nec. Morbi tempus nisl quis sapien rhoncus rutrum. Morbi vitae tortor non massa malesuada feugiat. Donec lobortis efficitur ultrices. Pellentesque fringilla, risus eu euismod condimentum, lacus metus tempus velit, vel dignissim sem neque nec mauris.',
        'Suspendisse condimentum justo vitae nunc finibus, non auctor erat aliquam. Donec sed nibh volutpat, efficitur libero in, tincidunt justo. Integer sapien ipsum, faucibus sit amet semper ut, ullamcorper quis velit. Sed sed enim id nibh imperdiet vulputate at sed elit. Pellentesque vel fringilla orci. Praesent semper gravida vehicula.',
        'Curabitur viverra ornare erat, in efficitur risus tempor sit amet. Proin sed efficitur arcu. Cras bibendum urna non turpis gravida, sed rhoncus tellus aliquet. Aenean tempus condimentum nisi sed vulputate. Vivamus ultricies leo eget dolor dignissim molestie.'
      ],
      highlights: [
        'ระบบแสดงเวลารอเฉลี่ยของแต่ละโรงพยาบาลแบบเรียลไทม์',
        'ปฏิทินอัจฉริยะสำหรับซิงก์นัดหมายกับโทรศัพท์มือถือ',
        'ชุดคำแนะนำการเตรียมตัวก่อนพบแพทย์และหลังการรักษา'
      ],
      footer:
        'Sed sit amet viverra enim. Donec sit amet justo ac urna dignissim faucibus. Phasellus pulvinar ac nunc ac viverra.'
    }
  },
  {
    icon: '📄',
    title: 'ยื่นคำร้องออนไลน์',
    description: 'ยื่นคำขอเอกสารราชการและติดตามความคืบหน้าแบบเรียลไทม์',
    link: '#',
    details: {
      paragraphs: [
        'Duis finibus libero vitae dolor porttitor vulputate. Sed ut velit id lorem congue fermentum. Aliquam consectetur sem ut fermentum pulvinar. Vestibulum lacinia libero quis ex rutrum, sit amet feugiat enim dictum. Sed tincidunt aliquet porta. Nulla facilisi. Sed et velit nunc. Nulla facilisi.',
        'Quisque at risus nibh. Nulla tempus sodales interdum. Nullam venenatis bibendum ante, sit amet ullamcorper arcu viverra ut. Integer consequat vitae nisl ut malesuada. Fusce hendrerit neque eget dolor posuere egestas. Pellentesque at nulla non arcu facilisis egestas.',
        'Nam eu magna tincidunt, ultricies nibh non, tempus metus. Praesent et urna vitae libero sollicitudin varius. Donec maximus, ligula vitae mollis convallis, sem ante tristique justo, ac dictum quam elit sit amet risus.'
      ],
      highlights: [
        'ระบบแนะนำฟอร์มที่เหมาะสมตามประเภทคำร้อง',
        'การแนบไฟล์เอกสารที่ปลอดภัยพร้อมตรวจสอบความครบถ้วน',
        'สรุปสถานะการพิจารณาแต่ละหน่วยงานในหน้าเดียว'
      ],
      footer:
        'Morbi a sem porttitor, sollicitudin nibh sit amet, maximus turpis. Cras aliquet nunc nec magna ullamcorper, quis pharetra erat vulputate.'
    }
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
                <article key={announcement.slug} className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                    {formatThaiDate(announcement.date)}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-neutral">{announcement.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{announcement.summary}</p>
                  <Link href={`/announcements/${announcement.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    อ่านเพิ่มเติม <span aria-hidden="true">→</span>
                  </Link>
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
                <ContactForm />
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
