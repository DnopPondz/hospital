import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';
import ContactForm from '@/components/ContactForm';

const contactChannels = [
  {
    title: 'ศูนย์บริการประชาชน',
    description: 'อาคารราชการไทย ถนนประชาธิปไตย เขตดุสิต กรุงเทพฯ 10300',
    detail: 'เปิดให้บริการวันจันทร์-ศุกร์ 08:30-16:30 น. (ยกเว้นวันหยุดราชการ)'
  },
  {
    title: 'สายด่วนภาครัฐ 1111',
    description: 'ให้บริการตลอด 24 ชั่วโมง พร้อมล่ามภาษาต่างประเทศตามนัดหมาย',
    detail: 'บริการแจ้งปัญหา ติดตามเรื่องร้องเรียน และให้คำปรึกษาเร่งด่วน'
  },
  {
    title: 'บริการสนทนาออนไลน์',
    description: 'เจ้าหน้าที่ตอบกลับภายใน 15 นาทีในเวลาราชการ',
    detail: 'พูดคุยผ่าน ThaiGov Connect, LINE Official และ Facebook Messenger'
  }
];

const supportTopics = [
  'ขอคำแนะนำการใช้บริการดิจิทัลหรือการจองคิว',
  'ติดตามความคืบหน้าของคำร้องและการส่งเอกสารเพิ่มเติม',
  'รายงานปัญหาเกี่ยวกับความปลอดภัยหรือความเป็นส่วนตัวของข้อมูล',
  'ประสานงานกับหน่วยงานเฉพาะด้าน เช่น สาธารณสุข มหาดไทย หรือแรงงาน'
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#e9f6ef] via-white to-[#cfe6d7]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(104,194,139,0.18),_transparent_55%)]" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-primary shadow-sm">
                <span className="h-2 w-2 rounded-full bg-primary" />
                ศูนย์ประสานงานประชาชน
              </span>
              <h1 className="text-3xl font-semibold text-neutral md:text-5xl">
                ติดต่อทีมงานผ่านช่องทางที่สะดวกที่สุด
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                ศูนย์บริการพร้อมดูแลทั้งแบบออนไลน์และออนไซต์ ไม่ว่าจะเป็นการจองคิว ยื่นคำร้อง ติดตามสถานะ หรือขอคำปรึกษาเฉพาะด้าน
              </p>
              <ul className="space-y-3 text-sm leading-6 text-slate-600">
                {supportTopics.map((topic) => (
                  <li key={topic} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                      ✓
                    </span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              <div className="section-wrapper space-y-6 p-8">
                <h2 className="text-lg font-semibold text-neutral">นัดหมายล่วงหน้า</h2>
                <p className="text-sm leading-6 text-slate-600">
                  เลือกวันเวลาที่สะดวกสำหรับการเข้าพบเจ้าหน้าที่หรือขอรับบริการผ่านวิดีโอคอล ระบบจะส่งอีเมลยืนยันและเตือนก่อนถึงเวลานัดหมาย 1 วัน
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  หากต้องการความช่วยเหลือเร่งด่วน โปรดโทรสายด่วน 1111 เพื่อเชื่อมต่อกับเจ้าหน้าที่ทันที
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <SectionTitle
            title="ช่องทางติดต่อหลัก"
            subtitle="เลือกวิธีที่เหมาะสมที่สุด ทีมงานพร้อมรับเรื่องและประสานงานไปยังหน่วยงานปลายทางให้"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {contactChannels.map((channel) => (
              <div key={channel.title} className="rounded-3xl border border-[#dcece2] bg-white/90 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-neutral">{channel.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{channel.description}</p>
                <p className="mt-4 text-xs text-slate-500">{channel.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#f4faf6] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
              <div className="space-y-6">
                <SectionTitle
                  title="แบบฟอร์มติดต่อออนไลน์"
                  subtitle="กรอกข้อมูลให้ครบถ้วน เจ้าหน้าที่จะติดต่อกลับผ่านอีเมลหรือโทรศัพท์ภายใน 1 วันทำการ"
                />
                <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm">
                  <ContactForm />
                </div>
              </div>
              <div className="section-wrapper space-y-6 p-8">
                <h3 className="text-base font-semibold text-neutral">แผนที่และการเดินทาง</h3>
                <div className="h-56 w-full overflow-hidden rounded-3xl border border-[#dcece2] bg-gradient-to-br from-[#cfe6d7] to-[#eaf8f0]">
                  <div className="flex h-full items-center justify-center text-sm font-semibold text-primary/70">
                    แผนที่ศูนย์บริการ (อยู่ระหว่างเตรียมข้อมูล)
                  </div>
                </div>
                <ul className="space-y-3 text-sm leading-6 text-slate-600">
                  <li>เดินทางด้วยรถไฟฟ้า MRT สถานีสามเสน หรือรถประจำทางสาย 10, 12, 19, 32</li>
                  <li>มีที่จอดรถบริการภายในอาคารและลานจอดรถบริเวณใกล้เคียง</li>
                  <li>บริการล่ามภาษามือและล่ามภาษาต่างประเทศตามการจองล่วงหน้า</li>
                </ul>
                <div className="rounded-3xl border border-[#c7e2d1] bg-[#eef7f1] p-6 text-sm text-slate-600">
                  กรุณานำบัตรประชาชนหรือเอกสารยืนยันตัวตนอื่น ๆ มาด้วยทุกครั้งเมื่อเข้ารับบริการที่ศูนย์
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
