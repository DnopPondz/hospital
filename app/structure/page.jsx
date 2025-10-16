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
  const leftDivisions = structure.divisions.slice(0, 2);
  const rightDivisions = structure.divisions.slice(2);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#ebf6ef] via-white to-[#daebdc] py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,106,61,0.14),_transparent_58%)]" />
          <div className="absolute inset-y-0 left-1/2 hidden w-[680px] -translate-x-1/2 rounded-full bg-gradient-to-b from-white/20 via-white/60 to-white/20 blur-3xl md:block" />
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_minmax(0,0.9fr)] lg:items-start">
              <div className="space-y-6">
                <SectionTitle
                  title="โครงสร้างบุคลากร"
                  subtitle="ผังสายการบังคับบัญชาที่เรียบง่ายและเป็นมิตรกับผู้ใช้งาน สอดรับกับดีไซน์ของเว็บไซต์"
                />
                <p className="text-sm leading-relaxed text-slate-600">
                  เราออกแบบผังนี้ให้สอดคล้องกับโทนสีและองค์ประกอบของเว็บไซต์ เพื่อให้ผู้อ่านเห็นบทบาทของผู้บริหารแต่ละระดับอย่างชัดเจน
                  ทั้งยังเน้นความต่อเนื่องของสายการบังคับบัญชา และเชื่อมโยงไปยังภารกิจที่แต่ละฝ่ายรับผิดชอบอยู่ในปัจจุบัน
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">แนวทางออกแบบ</p>
                    <p className="mt-2 text-sm text-slate-600">
                      ใช้จังหวะการ์ดโค้งมนและเส้นเชื่อมบางเพื่อให้ผังดูโปร่ง อ่านง่าย และเหมาะกับอุปกรณ์ทุกขนาดหน้าจอ
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">การจัดกลุ่ม</p>
                    <p className="mt-2 text-sm text-slate-600">
                      แยกผู้บริหารสายหลักไว้ตรงกลาง และจับคู่กลุ่มภารกิจซ้าย-ขวาเพื่อลดความหนาแน่น พร้อมไกด์ไลน์สีที่คงโทนสถาบัน
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/85 p-10 shadow-[0_35px_90px_rgba(13,106,61,0.12)]">
                <div className="pointer-events-none absolute -left-24 top-10 hidden h-40 w-40 rounded-full bg-primary/10 blur-3xl lg:block" />
                <div className="pointer-events-none absolute -right-20 bottom-10 hidden h-32 w-32 rounded-full bg-[#7bc99a]/20 blur-3xl lg:block" />
                <div className="relative flex flex-col items-center gap-12">
                  <div className="relative flex flex-col items-center">
                    <PersonnelCard variant="highlight" {...structure.director} />
                    <span className="mt-4 h-14 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />
                  </div>

                  <div className="relative flex flex-col items-center gap-6">
                    <PersonnelCard {...structure.deputy} />
                    <div className="relative hidden w-full items-center justify-center md:flex">
                      <span className="absolute top-0 h-px w-[70%] max-w-[420px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                      <span className="h-12 w-px bg-gradient-to-b from-primary/20 to-transparent" />
                    </div>
                  </div>

                  <div className="grid w-full gap-8 md:grid-cols-2">
                    {structure.divisions.map((division) => (
                      <div key={division.role} className="flex flex-col items-center gap-4">
                        <span className="hidden h-10 w-px bg-gradient-to-b from-primary/15 to-transparent md:block" />
                        <PersonnelCard {...division} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20 grid gap-6 rounded-[36px] border border-white/70 bg-white/80 p-10 shadow-[0_28px_60px_rgba(13,106,61,0.08)] lg:grid-cols-[1fr_minmax(0,1.1fr)]">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/70">มุมมองสายบังคับบัญชา</p>
                <h2 className="text-2xl font-semibold text-neutral">จัดวางผู้นำและฝ่ายปฏิบัติให้ชัดเจน</h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  ผู้อำนวยการและรองผู้อำนวยการถูกจัดให้อยู่แนวตั้งกลางเพื่อเน้นความเป็นศูนย์กลางการตัดสินใจ
                  ส่วนฝ่ายภารกิจจัดวางซ้าย-ขวาเพื่อสร้างสมดุลสายตาและง่ายต่อการเทียบบทบาท
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {[leftDivisions, rightDivisions].map((group, index) => (
                  <div key={index} className="rounded-3xl border border-primary/10 bg-white/90 p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/60">{index === 0 ? 'กลุ่มงานสนับสนุน' : 'กลุ่มงานปฏิบัติการ'}</p>
                    <ul className="mt-4 space-y-3 text-sm text-slate-600">
                      {group.map((division) => (
                        <li key={division.role} className="leading-6">
                          <span className="font-semibold text-primary">{division.name}</span> — {division.role}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
