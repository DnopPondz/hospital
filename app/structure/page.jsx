import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';

const structure = {
  director: {
    name: 'นพ. ศุภกฤต ชยางกูร',
    role: 'ผู้อำนวยการโรงพยาบาล',
    description:
      'กำกับดูแลทิศทางภาพรวมของโรงพยาบาล วางแผนยุทธศาสตร์ และประสานความร่วมมือกับทุกฝ่ายให้บริการประชาชนอย่างทั่วถึง',
    initials: 'ศช'
  },
  deputy: {
    name: 'นางศิรดา รุ่งแสง',
    role: 'รองผู้อำนวยการกลุ่มภารกิจอำนวยการ',
    description:
      'ดูแลงานนโยบายภายใน งานบริหารสำนักงาน และหน่วยงานสนับสนุนที่เชื่อมการทำงานของฝ่ายบริหารกับฝ่ายปฏิบัติ',
    initials: 'ศร'
  },
  divisions: [
    {
      name: 'นพ. ณัฐภัทร บำรุงไทย',
      role: 'รองผู้อำนวยการกลุ่มภารกิจด้านการแพทย์',
      description:
        'ดูแลมาตรฐานการรักษา คลินิกเฉพาะทาง และการพัฒนาศักยภาพทีมแพทย์เพื่อคุณภาพการรักษาที่ดีที่สุด',
      initials: 'ณบ'
    },
    {
      name: 'นางสาว วราภรณ์ ศรีสุข',
      role: 'รองผู้อำนวยการกลุ่มภารกิจด้านการพยาบาล',
      description:
        'บริหารจัดการบุคลากรพยาบาลและระบบการพยาบาลทุกหน่วย ให้บริการด้วยมาตรฐานเดียวกันทั้งโรงพยาบาล',
      initials: 'วศ'
    },
    {
      name: 'นายสมาน จิตรวิจิตร',
      role: 'รองผู้อำนวยการกลุ่มภารกิจด้านสนับสนุนบริการ',
      description:
        'รับผิดชอบงานสนับสนุน เช่น เวชภัณฑ์ โลจิสติกส์ และอาคารสถานที่ เพื่อให้การรักษาเป็นไปอย่างราบรื่น',
      initials: 'สจ'
    },
    {
      name: 'นางสาว พิมลรัตน์ ทองประเสริฐ',
      role: 'รองผู้อำนวยการกลุ่มภารกิจด้านยุทธศาสตร์',
      description:
        'วางแผนยุทธศาสตร์ ดำเนินงานด้านข้อมูลสารสนเทศ และขับเคลื่อนการพัฒนานวัตกรรมของโรงพยาบาล',
      initials: 'พท'
    }
  ]
};

export const metadata = {
  title: 'โครงสร้างบุคลากร | สำนักงานราชการกลาง'
};

const PersonnelCard = ({ name, role, description, initials, variant = 'default' }) => (
  <div
    className={`relative flex w-full max-w-[280px] flex-col items-center gap-6 rounded-[28px] border bg-white/80 px-7 py-9 text-center shadow-[0_24px_60px_rgba(13,106,61,0.08)] backdrop-blur-sm transition-all ${
      variant === 'highlight'
        ? 'border-primary/50 bg-gradient-to-b from-[#edf9f2] to-white'
        : 'border-primary/10'
    }`}
  >
    <div
      className={`flex h-28 w-28 items-center justify-center rounded-full border-4 border-white text-3xl font-semibold shadow-[0_20px_35px_rgba(15,106,61,0.35)] ${
        variant === 'highlight'
          ? 'bg-gradient-to-br from-[#0f6a3d] via-[#1faa60] to-[#46ce84] text-white'
          : 'bg-gradient-to-br from-[#d4ecdf] via-[#bfe0cc] to-[#94c6a9] text-neutral'
      }`}
    >
      {initials}
    </div>
    <div className="space-y-3">
      <p className={`text-[11px] font-semibold uppercase tracking-[0.4em] ${variant === 'highlight' ? 'text-primary/80' : 'text-primary/60'}`}>
        {role}
      </p>
      <h3 className="text-xl font-semibold text-neutral">{name}</h3>
      {description ? <p className="text-sm leading-relaxed text-slate-600">{description}</p> : null}
    </div>
    {variant === 'highlight' ? (
      <span className="absolute -top-4 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white shadow-lg">
        ผู้นำ
      </span>
    ) : null}
  </div>
);

export default function PersonnelStructurePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#ebf6ef] via-white to-[#daebdc] py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,106,61,0.14),_transparent_58%)]" />
          <div className="absolute inset-y-0 left-1/2 hidden w-[620px] -translate-x-1/2 rounded-full bg-gradient-to-b from-white/20 via-white/60 to-white/20 blur-3xl md:block" />
          <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6">
            <SectionTitle
              title="โครงสร้างบุคลากร"
              subtitle="จัดวางผู้นำและฝ่ายปฏิบัติให้อยู่ในแนวตั้งกลาง พร้อมเส้นโยงที่เชื่อมสายการบังคับบัญชาอย่างชัดเจน"
            />

            <p className="mt-6 max-w-2xl text-center text-sm leading-relaxed text-slate-600">
              ผังบุคลากรถูกออกแบบให้เห็นลำดับชั้นตั้งแต่ผู้อำนวยการถึงกลุ่มภารกิจได้ในมุมมองเดียว โดยใช้เส้นเชื่อมและการจัดวางที่สมดุลกับโทนสีของเว็บไซต์
              เพื่อความเข้าใจง่ายทั้งบนหน้าจอคอมพิวเตอร์และมือถือ
            </p>

            <div className="relative mt-16 flex w-full max-w-4xl flex-col items-center gap-14 rounded-[36px] border border-white/70 bg-white/85 p-10 shadow-[0_35px_90px_rgba(13,106,61,0.12)]">
              <div className="pointer-events-none absolute -left-20 top-16 hidden h-32 w-32 rounded-full bg-primary/10 blur-3xl lg:block" />
              <div className="pointer-events-none absolute -right-16 bottom-12 hidden h-28 w-28 rounded-full bg-[#7bc99a]/20 blur-3xl lg:block" />

              <div className="flex flex-col items-center">
                <PersonnelCard variant="highlight" {...structure.director} />
                <span className="mt-6 h-16 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />
              </div>

              <div className="flex flex-col items-center">
                <PersonnelCard {...structure.deputy} />
                <span className="mt-6 h-16 w-px bg-gradient-to-b from-primary/30 via-primary/20 to-transparent" />
              </div>

              <div className="relative w-full max-w-4xl">
                <span className="pointer-events-none absolute left-1/2 top-0 h-16 w-px -translate-x-1/2 bg-gradient-to-b from-primary/30 via-primary/20 to-transparent" />
                <div className="relative mt-12 grid gap-10 md:grid-cols-2 md:before:absolute md:before:left-0 md:before:right-0 md:before:top-0 md:before:h-px md:before:bg-gradient-to-r md:before:from-transparent md:before:via-primary/25 md:before:to-transparent md:before:content-['']">
                  {structure.divisions.map((division) => (
                    <div
                      key={division.role}
                      className="relative flex flex-col items-center pt-10 md:pt-12"
                    >
                      <span className="absolute left-1/2 top-0 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-primary/20 via-primary/15 to-transparent md:h-12" />
                      <PersonnelCard {...division} />
                    </div>
                  ))}
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
