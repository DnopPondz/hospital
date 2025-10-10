import Link from 'next/link';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
import ServiceCard from '@/components/ServiceCard';
import { coreServices } from '@/lib/services';

const lifeMoments = [
  {
    title: 'เริ่มต้นชีวิตการทำงาน',
    description: 'สมัครเข้าร่วมกองทุนบำเหน็จบำนาญ ตรวจสอบสิทธิประกันสังคม และลงทะเบียนภาษีออนไลน์',
    steps: ['สร้างบัญชีภาครัฐและยืนยันตัวตน', 'เลือกกองทุนและสิทธิที่ต้องการ', 'ติดตามการอนุมัติและรับเอกสารสำคัญ']
  },
  {
    title: 'สร้างครอบครัว',
    description: 'จดทะเบียนสมรส ขอใบเกิด และลงทะเบียนสิทธิประกันสุขภาพสำหรับครอบครัว',
    steps: ['จองคิวที่สำนักทะเบียนใกล้บ้าน', 'กรอกแบบฟอร์มดิจิทัลล่วงหน้า', 'รับเอกสารฉบับจริงหรือเลือกจัดส่งถึงบ้าน']
  },
  {
    title: 'เตรียมเกษียณ',
    description: 'ตรวจสอบสิทธิผู้สูงอายุ รับสวัสดิการ และจัดการเอกสารกองทุนสำรองเลี้ยงชีพ',
    steps: ['ตรวจสอบข้อมูลอัพเดตจากหน่วยงานต้นสังกัด', 'ยื่นคำร้องรับสิทธิผ่านระบบออนไลน์', 'ติดตามสถานะพร้อมรับการแจ้งเตือนสำคัญ']
  }
];

const supportHighlights = [
  {
    title: 'คู่มือแบบอินเตอร์แอคทีฟ',
    description: 'ทุกบริการมีสรุปขั้นตอน วิดีโอแนะนำ และตัวอย่างเอกสารที่ต้องเตรียมให้พร้อม'
  },
  {
    title: 'ผู้ช่วยตอบคำถาม 24 ชม.',
    description: 'สนทนาได้ทั้งภาษาไทยและอังกฤษ พร้อมต่อสายให้เจ้าหน้าที่ตามเวลาราชการ'
  },
  {
    title: 'ติดตามสถานะแบบรวมศูนย์',
    description: 'ดูความคืบหน้าทุกคำร้องในหน้าเดียว และเลือกปักหมุดงานที่ต้องการให้แจ้งเตือนพิเศษ'
  }
];

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#e7f3ec] via-white to-[#d4e8dc]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(104,194,139,0.16),_transparent_60%)]" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-primary shadow-sm">
                <span className="h-2 w-2 rounded-full bg-primary" />
                บริการภาครัฐในชีวิตประจำวัน
              </span>
              <h1 className="text-3xl font-semibold text-neutral md:text-5xl">
                เลือกบริการได้ตามช่วงชีวิต พร้อมตัวช่วยทุกขั้นตอน
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                ศูนย์บริการประชาชนรวบรวมบริการยอดนิยมและคู่มือการใช้งานในรูปแบบดิจิทัล ตั้งแต่การขอเอกสารราชการไปจนถึงการดูแลสิทธิประโยชน์
                พร้อมระบบติดตามสถานะที่โปร่งใสและแจ้งเตือนตรงเวลา
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/digital"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-neutral"
                >
                  ใช้บริการผ่าน ThaiGov Connect
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
                >
                  ขอคำปรึกษากับเจ้าหน้าที่
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <div className="section-wrapper space-y-6 p-8">
                <h2 className="text-lg font-semibold text-neutral">บริการที่เปิดใช้งานบ่อยที่สุด</h2>
                <div className="space-y-4 text-sm text-slate-600">
                  <p>• ยื่นคำร้องขอเอกสารราชการพร้อมชำระค่าธรรมเนียมออนไลน์</p>
                  <p>• ตรวจสอบสิทธิประกันสังคมและสิทธิด้านสาธารณสุข</p>
                  <p>• จองคิวทำบัตรประชาชนและบัตรสวัสดิการแห่งรัฐ</p>
                  <p>• ลงทะเบียนโครงการสวัสดิการใหม่ล่าสุด</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <SectionTitle
            title="หมวดบริการหลัก"
            subtitle="เลือกบริการตามภารกิจที่ต้องการ แล้วดูรายละเอียดเชิงลึกผ่านหน้าต่างข้อมูลแบบโต้ตอบ"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {coreServices.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </section>

        <section className="bg-[#f4faf6] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
              <div className="space-y-8">
                <SectionTitle
                  title="วางแผนตามช่วงชีวิต"
                  subtitle="ระบบช่วยจัดกลุ่มบริการตามสถานการณ์สำคัญ เพื่อให้ดำเนินการครบถ้วนในครั้งเดียว"
                />
                <div className="space-y-6">
                  {lifeMoments.map((moment) => (
                    <div key={moment.title} className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm">
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral">{moment.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{moment.description}</p>
                        </div>
                        <span className="hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary md:block">
                          Journey
                        </span>
                      </div>
                      <ol className="mt-4 space-y-3 text-sm text-slate-600">
                        {moment.steps.map((step, index) => (
                          <li key={step} className="flex items-start gap-3">
                            <span className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
              <div className="section-wrapper space-y-6 p-8">
                <h3 className="text-base font-semibold text-neutral">เครื่องมือช่วยเหลือ</h3>
                <ul className="space-y-4 text-sm leading-6 text-slate-600">
                  {supportHighlights.map((item) => (
                    <li key={item.title} className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm">
                      <h4 className="text-base font-semibold text-neutral">{item.title}</h4>
                      <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                    </li>
                  ))}
                </ul>
                <div className="rounded-3xl border border-[#c7e2d1] bg-[#eef7f1] p-6 text-sm text-slate-600">
                  ทุกบริการมีระบบแจ้งเตือนอัตโนมัติและสามารถบันทึกเอกสารสำคัญไว้ในคลาวด์ที่ได้รับการรับรองมาตรฐานความปลอดภัย
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="section-wrapper grid gap-10 p-10 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-4">
              <SectionTitle
                title="วางแผนก่อนยื่นคำร้อง"
                subtitle="ระบบช่วยตรวจสอบความพร้อมของเอกสารและนัดหมายให้เสร็จภายในไม่กี่คลิก"
              />
              <p className="text-sm leading-7 text-slate-600">
                แต่ละบริการจะมีรายการเอกสาร ตัวอย่างแบบฟอร์ม และการเชื่อมต่อกับหน่วยงานที่เกี่ยวข้องแบบอัตโนมัติ ลดขั้นตอนที่ต้องเดินทางซ้ำและลดระยะเวลารอคอยในวันจริง
              </p>
              <Link
                href="/digital"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                เรียนรู้การใช้เครื่องมือตรวจสอบเอกสาร <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="space-y-4 text-sm text-slate-600">
              <div className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-neutral">ระบบตรวจเอกสารอัตโนมัติ</h3>
                <p className="mt-2 leading-6">
                  อัปโหลดไฟล์สำคัญ ระบบจะแจ้งเตือนหากข้อมูลไม่ครบหรือรูปแบบไม่ถูกต้อง พร้อมแนวทางแก้ไขทันที
                </p>
              </div>
              <div className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-neutral">จองคิวและติดตามสถานะ</h3>
                <p className="mt-2 leading-6">
                  เลือกวันเวลาที่สะดวก และรับบัตรคิวดิจิทัล พร้อมติดตามการเรียกคิวผ่านมือถือแบบเรียลไทม์
                </p>
              </div>
              <div className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-neutral">บันทึกประวัติการใช้บริการ</h3>
                <p className="mt-2 leading-6">
                  ดูประวัติการยื่นคำร้องย้อนหลัง จัดเก็บเอกสารสำคัญ และต่อยอดสู่บริการอื่นได้รวดเร็ว
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
