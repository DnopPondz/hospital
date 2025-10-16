import Link from 'next/link';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';

const platformPillars = [
  {
    title: 'บัญชีเดียวเข้าถึงทุกบริการ',
    description: 'ลงทะเบียนด้วยบัตรประชาชนหรือแอป ThaID แล้วใช้บัญชีเดียวเชื่อมต่อทุกหน่วยงานภาครัฐ'
  },
  {
    title: 'แดชบอร์ดสถานะครบวงจร',
    description: 'ดูความคืบหน้าคำร้อง แจ้งเตือนเอกสารที่จะหมดอายุ และรับคำแนะนำต่อเนื่องจากผู้ช่วยอัจฉริยะ'
  },
  {
    title: 'ทำงานร่วมกับหน่วยงานได้ทันที',
    description: 'ส่งเอกสาร รับแบบฟอร์ม และจองคิวนัดหมายผ่านระบบเดียว ลดการเดินทางซ้ำและโทรติดตาม'
  }
];

const securityHighlights = [
  'มาตรฐานการยืนยันตัวตนหลายปัจจัย (MFA) รองรับทั้งบัตรประชาชน ชิปการ์ด และชีวมิติ',
  'ระบบเข้ารหัสข้อมูลแบบ End-to-End พร้อมบันทึกการเข้าถึงเพื่อการตรวจสอบย้อนหลัง',
  'ศูนย์สำรองข้อมูลภายในประเทศตามมาตรฐาน ISO/IEC 27001 และ PDPA'
];

const integrationTracks = [
  {
    name: 'สาธารณสุข',
    agencies: ['ระบบนัดหมายโรงพยาบาล', 'ตรวจสอบสิทธิรักษาพยาบาล', 'ใบรับรองแพทย์ดิจิทัล']
  },
  {
    name: 'ทะเบียนราษฎร',
    agencies: ['จองคิวทำบัตรประชาชน', 'แจ้งย้ายที่อยู่', 'ขอคัดสำเนาทะเบียนบ้าน']
  },
  {
    name: 'สิทธิประโยชน์และสวัสดิการ',
    agencies: ['ตรวจสอบสิทธิประกันสังคม', 'ลงทะเบียนบัตรสวัสดิการแห่งรัฐ', 'ยื่นขอสวัสดิการผู้สูงอายุ']
  }
];

export default function DigitalPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#e8f6ef] via-white to-[#cfe6d7]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(104,194,139,0.16),_transparent_60%)]" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-primary shadow-sm">
                <span className="h-2 w-2 rounded-full bg-primary" />
                ThaiGov Connect
              </span>
              <h1 className="text-3xl font-semibold text-neutral md:text-5xl">
                ศูนย์กลางบริการดิจิทัลที่รวมทุกงานราชการไว้ในหน้าจอเดียว
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                เชื่อมต่อบริการ กำหนดสิทธิ และติดตามงานราชการได้จากทุกที่ พร้อมผู้ช่วยอัจฉริยะที่ช่วยตอบคำถามและแนะนำขั้นตอนที่เหมาะสม
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_-18px_rgba(16,185,129,0.65)] transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                >
                  เริ่มสำรวจบริการที่เชื่อมต่อ
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                >
                  ติดต่อทีมสนับสนุน
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <div className="section-wrapper space-y-6 p-8">
                <h2 className="text-lg font-semibold text-neutral">เสาหลักของแพลตฟอร์ม</h2>
                <ul className="space-y-4 text-sm leading-6 text-slate-600">
                  {platformPillars.map((pillar) => (
                    <li key={pillar.title} className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm">
                      <h3 className="text-base font-semibold text-neutral">{pillar.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{pillar.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <SectionTitle
            title="เครื่องมือที่พร้อมใช้งาน"
            subtitle="เลือกใช้งานได้ทั้งผ่านเว็บและแอปพลิเคชัน โดยข้อมูลทั้งหมดซิงก์กันแบบเรียลไทม์"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral">ศูนย์แจ้งเตือนอัจฉริยะ</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                ปรับระดับความสำคัญของการแจ้งเตือน กำหนดเวลาที่เหมาะสม และเชื่อมต่อกับอีเมลหรือแอปแชทที่ใช้งานอยู่แล้ว
              </p>
            </div>
            <div className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral">ผู้ช่วยสนทนาแบบเรียลไทม์</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                ระบบสนทนาที่เข้าใจภาษาไทยและภาษาอังกฤษ ช่วยค้นหาขั้นตอนเอกสาร ติดตามสถานะ และยื่นคำร้องแทนได้ในบางบริการ
              </p>
            </div>
            <div className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral">ศูนย์เก็บเอกสารสำคัญ</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                จัดเก็บไฟล์ต้นฉบับรับรองดิจิทัล พร้อมบันทึกเวอร์ชัน และแชร์ให้หน่วยงานปลายทางได้อย่างปลอดภัยภายใต้การยินยอมของคุณ
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#f4faf6] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
              <div className="space-y-4">
                <SectionTitle
                  title="ความปลอดภัยระดับสากล"
                  subtitle="ระบบรักษาความปลอดภัยถูกออกแบบร่วมกับหน่วยงานด้านความมั่นคง เพื่อปกป้องข้อมูลประชาชนในทุกขั้นตอน"
                />
                <ul className="space-y-3 text-sm leading-6 text-slate-600">
                  {securityHighlights.map((item) => (
                    <li key={item} className="flex items-start gap-3 rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm">
                      <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="section-wrapper space-y-6 p-8">
                <h3 className="text-base font-semibold text-neutral">บริการที่เชื่อมต่อแล้ว</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {integrationTracks.map((track) => (
                    <div key={track.name} className="rounded-3xl border border-[#dcece2] bg-white/90 p-5 shadow-sm">
                      <h4 className="text-base font-semibold text-neutral">{track.name}</h4>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                        {track.agencies.map((agency) => (
                          <li key={agency}>{agency}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="rounded-3xl border border-[#c7e2d1] bg-[#eef7f1] p-6 text-sm text-slate-600">
                  หน่วยงานที่ต้องการเชื่อมต่อระบบสามารถติดต่อทีมบูรณาการเพื่อรับชุดพัฒนาซอฟต์แวร์ (SDK) และมาตรฐาน API ได้โดยตรง
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="section-wrapper grid gap-10 p-10 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-4">
              <SectionTitle
                title="เริ่มต้นใช้งานในไม่กี่นาที"
                subtitle="ทำตามขั้นตอนต่อไปนี้เพื่อเปิดใช้งานบัญชีและผูกบริการที่ต้องการ"
              />
              <ol className="space-y-4 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                    1
                  </span>
                  <span>ลงทะเบียนหรือเข้าสู่ระบบด้วยบัตรประชาชน/ThaID และตั้งค่าความปลอดภัยหลายชั้น</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                    2
                  </span>
                  <span>เลือกบริการที่ต้องการผูก พร้อมกำหนดการแจ้งเตือนและมอบหมายสิทธิให้สมาชิกในครอบครัวหรือตัวแทน</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                    3
                  </span>
                  <span>ติดตามความคืบหน้าในแดชบอร์ดและรับคำแนะนำเพิ่มเติมจากผู้ช่วยอัจฉริยะได้ตลอดเวลา</span>
                </li>
              </ol>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                ดูบริการที่พร้อมเชื่อมต่อทั้งหมด <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="space-y-4 text-sm text-slate-600">
              <div className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-neutral">ศูนย์บริการผู้ใช้งาน</h3>
                <p className="mt-2 leading-6">
                  มีทีมเจ้าหน้าที่พร้อมดูแลผ่านแชท โทรศัพท์ และศูนย์บริการภาคสนามทั่วประเทศ พร้อมคู่มือการใช้งานแบบวิดีโอ
                </p>
              </div>
              <div className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-neutral">อัปเดตฟีเจอร์รายเดือน</h3>
                <p className="mt-2 leading-6">
                  ระบบจะมีการอัปเดตฟีเจอร์ใหม่ทุกเดือน พร้อมบันทึกการเปลี่ยนแปลงและคู่มือสรุปให้ผู้ใช้งานทราบ
                </p>
              </div>
              <div className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-neutral">ชุมชนผู้ใช้งาน</h3>
                <p className="mt-2 leading-6">
                  เข้าร่วมแลกเปลี่ยนเคล็ดลับกับประชาชนและเจ้าหน้าที่หน่วยงานต่าง ๆ เพื่อปรับปรุงบริการร่วมกัน
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
