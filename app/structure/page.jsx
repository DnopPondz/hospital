import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';

const leadership = {
  title: 'ปลัดกระทรวงสาธารณสุข',
  name: 'นพ. ธนากร สุขเกษม',
  description:
    'กำหนดทิศทางเชิงยุทธศาสตร์และกำกับมาตรฐานบริการสุขภาพระดับชาติ เชื่อมโยงการทำงานของทุกกอง/สำนักให้ตอบสนองนโยบายรัฐบาลและความต้องการของประชาชนอย่างมีเอกภาพ',
  support:
    'สำนักงานเลขานุการปลัดและคณะทำงานเฉพาะกิจด้านข้อมูล ช่วยบูรณาการงานเอกสาร การสื่อสารวิกฤต และการติดตามตัวชี้วัดร่วมกับหน่วยงานภายในและภายนอกกระทรวง'
};

const branches = [
  {
    title: 'รองปลัดฯ ฝ่ายระบบบริการดิจิทัล',
    name: 'นางสาว พิมพ์ลดา วิริยะโชติ',
    focus:
      'พัฒนาบริการดิจิทัลและโครงสร้างพื้นฐานข้อมูลสุขภาพระดับชาติ เพื่อยกระดับการเข้าถึงบริการของประชาชนแบบไร้รอยต่อ',
    teams: [
      {
        unit: 'กองนโยบายและกำกับบริการดิจิทัล',
        lead: 'ผอ. ศุภชัย อารีรัตน์',
        remit: 'วางมาตรฐาน แผนปฏิบัติการ และสัญญาบริการร่วมกับหน่วยงานปลายทาง'
      },
      {
        unit: 'ศูนย์ปฏิบัติการข้อมูลสุขภาพ',
        lead: 'ผอ. ชุติมา เกษมสุข',
        remit: 'ดูแลศูนย์ข้อมูลกลาง การวิเคราะห์ และความปลอดภัยข้อมูล'
      },
      {
        unit: 'หน่วยนวัตกรรมภาคประชาชน',
        lead: 'ผอ. พรทิพย์ บวรเดช',
        remit: 'ออกแบบประสบการณ์ผู้ใช้ ทดลองต้นแบบ และรับฟังเสียงประชาชน'
      }
    ]
  },
  {
    title: 'รองปลัดฯ ฝ่ายบริการปฐมภูมิและจังหวัด',
    name: 'นพ. วิศิษฏ์ ศานติเสถียร',
    focus:
      'กำกับเครือข่ายโรงพยาบาลชุมชนและสถานีอนามัยทั่วประเทศ ประสานการใช้ทรัพยากรและบุคลากรให้เหมาะสมตามบริบทพื้นที่',
    teams: [
      {
        unit: 'กองประสานบริการพื้นที่',
        lead: 'ผอ. รจนา จิตร์ประเสริฐ',
        remit: 'เชื่อมโยงเขตสุขภาพ 13 เขตกับยุทธศาสตร์กระทรวงและจังหวัด'
      },
      {
        unit: 'ศูนย์สนับสนุนบริการเคลื่อนที่',
        lead: 'ผอ. วรเดช ปัญญาวุฒิ',
        remit: 'บริหารหน่วยแพทย์เคลื่อนที่และระบบตอบสนองภัยพิบัติ'
      },
      {
        unit: 'กลุ่มเสริมสร้างความรอบรู้สุขภาพ',
        lead: 'ผอ. อรุณี แสงเพชร',
        remit: 'พัฒนาสื่อสุขภาพ พี่เลี้ยง อสม. และการสื่อสารเชิงรุกในชุมชน'
      }
    ]
  },
  {
    title: 'รองปลัดฯ ฝ่ายทรัพยากรบุคคลและสนับสนุน',
    name: 'นาง นภารัตน์ อินทรชัย',
    focus:
      'เสริมสร้างศักยภาพบุคลากร ระบบสนับสนุน และธรรมาภิบาล เพื่อให้การบริการสุขภาพดำเนินไปอย่างยั่งยืน',
    teams: [
      {
        unit: 'กองพัฒนากำลังคนสุขภาพ',
        lead: 'ผอ. ปริญญา สมจริง',
        remit: 'วางแผนกำลังคน การพัฒนาทักษะ และเส้นทางความก้าวหน้า'
      },
      {
        unit: 'ศูนย์บริหารทรัพยากรและงบประมาณ',
        lead: 'ผอ. จักรี ศรีหงษ์ทอง',
        remit: 'จัดการงบประมาณ การพัสดุ และระบบสนับสนุนส่วนกลาง'
      },
      {
        unit: 'สำนักธรรมาภิบาลและตรวจสอบ',
        lead: 'ผอ. สุพจน์ บุญช่วย',
        remit: 'กำกับมาตรฐาน จัดการความเสี่ยง และระบบข้อร้องเรียน'
      }
    ]
  }
];

const rootSupports = [
  {
    title: 'ศูนย์ข้อมูลกลาง',
    description: 'โครงสร้างพื้นฐานด้านข้อมูลและ API กลาง สนับสนุนการแลกเปลี่ยนข้อมูลข้ามระบบและการวิเคราะห์เชิงนโยบาย'
  },
  {
    title: 'ทีมสื่อสารวิกฤต',
    description: 'ดูแลการสื่อสารสาธารณะและการบริหารจัดการข่าวสาร ในภาวะฉุกเฉินและสถานการณ์สำคัญ'
  },
  {
    title: 'กองกฎหมายและธรรมาภิบาล',
    description: 'ให้คำปรึกษากฎหมาย กำกับดูแลสัญญา และยกระดับความโปร่งใสในทุกขั้นตอนการดำเนินงาน'
  }
];

export const metadata = {
  title: 'โครงสร้างบุคลากร | สำนักงานราชการกลาง'
};

export default function PersonnelStructurePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#edf7f1] via-white to-[#d9ecd9] py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,106,61,0.15),_transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-6">
            <SectionTitle
              title="โครงสร้างบุคลากร"
              subtitle="ผังการบังคับบัญชาในรูปแบบรากต้นไม้ แสดงความเชื่อมโยงระหว่างผู้บริหารและหน่วยงานสนับสนุน"
            />

            <div className="mt-16 flex flex-col items-center gap-16">
              <div className="flex flex-col items-center text-center">
                <div className="section-wrapper w-full max-w-3xl space-y-4 px-8 py-10">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">ศูนย์กลางการบริหาร</span>
                  <h3 className="text-2xl font-semibold text-neutral md:text-3xl">{leadership.title}</h3>
                  <p className="text-base font-medium text-primary">{leadership.name}</p>
                  <p className="text-sm leading-relaxed text-slate-600">{leadership.description}</p>
                  <div className="rounded-3xl border border-[#dbece1] bg-[#f4fbf6] px-6 py-4 text-left text-sm text-slate-600">
                    <p className="font-semibold text-neutral">ทีมสนับสนุนใกล้ชิด</p>
                    <p className="mt-2 leading-relaxed">{leadership.support}</p>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-center">
                  <div className="h-16 w-px bg-gradient-to-b from-primary/40 via-primary/30 to-transparent" />
                </div>
              </div>

              <div className="relative w-full">
                <div className="pointer-events-none absolute left-0 right-0 top-0 hidden h-px -translate-y-10 bg-gradient-to-r from-transparent via-primary/20 to-transparent md:block" />
                <div className="grid gap-10 md:grid-cols-3">
                  {branches.map((branch) => (
                    <div key={branch.title} className="flex flex-col items-center gap-8 text-center md:text-left">
                      <div className="section-wrapper w-full space-y-4 px-6 py-8">
                        <span className="text-xs font-semibold uppercase tracking-wide text-primary/70">{branch.title}</span>
                        <h4 className="text-xl font-semibold text-neutral">{branch.name}</h4>
                        <p className="text-sm leading-relaxed text-slate-600">{branch.focus}</p>
                      </div>
                      <div className="flex w-full flex-col gap-6 border-l border-dashed border-primary/25 pl-6">
                        {branch.teams.map((team) => (
                          <div key={team.unit} className="relative rounded-3xl border border-[#d7e9de] bg-white/80 px-5 py-4 shadow-sm">
                            <span className="absolute -left-[37px] top-1/2 hidden h-px w-9 -translate-y-1/2 bg-primary/20 md:block" />
                            <p className="text-sm font-semibold text-neutral">{team.unit}</p>
                            <p className="text-xs text-primary/80">{team.lead}</p>
                            <p className="mt-2 text-xs leading-relaxed text-slate-600">{team.remit}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative w-full max-w-5xl">
                <div className="absolute inset-x-12 top-0 h-10 -translate-y-12 rounded-b-full border-x border-b border-primary/15 bg-gradient-to-b from-transparent via-[#e4f3ea] to-[#cbe5d3]" />
                <div className="section-wrapper relative z-10 grid gap-6 px-8 py-10 md:grid-cols-3">
                  {rootSupports.map((support) => (
                    <div key={support.title} className="flex flex-col gap-3">
                      <h5 className="text-sm font-semibold uppercase tracking-wide text-neutral">{support.title}</h5>
                      <p className="text-sm leading-relaxed text-slate-600">{support.description}</p>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-x-1/3 bottom-[-48px] h-24 rounded-full bg-gradient-to-b from-[#c9e5d1] via-[#b8dbc4] to-transparent blur-xl" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
