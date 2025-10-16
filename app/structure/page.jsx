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
    className={`relative flex w-full max-w-[260px] flex-col items-center gap-5 rounded-3xl border bg-white/80 px-6 py-8 text-center shadow-[0_18px_45px_rgba(13,106,61,0.08)] backdrop-blur-sm transition-colors ${
      variant === 'highlight'
        ? 'border-primary/40 bg-gradient-to-b from-[#f0fbf4] to-white'
        : 'border-primary/15'
    }`}
  >
    <div
      className={`flex h-28 w-28 items-center justify-center rounded-full border-4 border-white text-3xl font-semibold shadow-lg ${
        variant === 'highlight'
          ? 'bg-gradient-to-br from-[#0e6a3d] via-[#16a34a] to-[#1ec76c] text-white'
          : 'bg-gradient-to-br from-[#cfe9da] via-[#b2ddc3] to-[#8fcaa9] text-neutral'
      }`}
    >
      {initials}
    </div>
    <div className="space-y-3">
      <p className="text-xs font-semibold tracking-[0.3em] text-primary/70">{role}</p>
      <h3 className="text-xl font-semibold text-neutral">{name}</h3>
      {description ? (
        <p className="text-sm leading-relaxed text-slate-600">{description}</p>
      ) : null}
    </div>
  </div>
);

export default function PersonnelStructurePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#edf7f1] via-white to-[#d9ecd9] py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,106,61,0.12),_transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-6">
            <SectionTitle
              title="โครงสร้างบุคลากร"
              subtitle="ถ่ายทอดโครงสร้างการบังคับบัญชาแบบสายตรง ชัดเจน เห็นความเชื่อมโยงของผู้บริหารทุกระดับ"
            />

            <div className="mt-16 flex flex-col items-center gap-16">
              <div className="flex flex-col items-center">
                <PersonnelCard variant="highlight" {...structure.director} />
                <div className="mt-6 h-16 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />
              </div>

              <div className="flex w-full flex-col items-center">
                <PersonnelCard {...structure.deputy} />
                <div className="relative mt-6 flex w-full max-w-4xl flex-col items-center">
                  <div className="h-14 w-px bg-primary/20" />
                  <div className="absolute top-14 left-6 right-6 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block" />
                </div>
              </div>

              <div className="relative w-full max-w-5xl pt-12">
                <div className="pointer-events-none absolute inset-x-6 top-0 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block" />
                <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
                  {structure.divisions.map((division) => (
                    <div key={division.role} className="relative flex flex-col items-center">
                      <span className="absolute -top-12 hidden h-12 w-px bg-primary/20 md:block" />
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
