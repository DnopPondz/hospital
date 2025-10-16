import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';

const leadership = {
  position: 'ปลัดกระทรวงสาธารณสุข',
  name: 'นพ. ธนากร สุขเกษม',
  description:
    'กำหนดทิศทางเชิงยุทธศาสตร์และกำกับมาตรฐานบริการสุขภาพระดับชาติ เชื่อมโยงการทำงานของทุกกอง/สำนักให้ตอบสนองนโยบายรัฐบาลและความต้องการของประชาชนอย่างมีเอกภาพ',
  focus:
    'บูรณาการข้อมูลระดับชาติและระบบติดตามผล เพื่อให้การตัดสินใจด้านสาธารณสุขมีความรวดเร็วและแม่นยำ',
  photo: '/images/personnel/demo-profile.svg'
};

const branches = [
  {
    position: 'รองปลัดฯ ฝ่ายระบบบริการดิจิทัล',
    name: 'นางสาว พิมพ์ลดา วิริยะโชติ',
    summary:
      'พัฒนาบริการดิจิทัล โครงสร้างพื้นฐานข้อมูล และประสบการณ์ดิจิทัลของประชาชนให้เชื่อมโยงกันทั้งประเทศ',
    photo: '/images/personnel/demo-profile.svg',
    teams: [
      {
        position: 'ผอ. กองนโยบายและกำกับบริการดิจิทัล',
        name: 'นาย ศุภชัย อารีรัตน์',
        focus: 'กำหนดมาตรฐานข้อมูลสุขภาพกลางและกำกับสัญญาบริการกับหน่วยงานปลายทาง',
        photo: '/images/personnel/demo-profile.svg'
      },
      {
        position: 'ผอ. ศูนย์ปฏิบัติการข้อมูลสุขภาพ',
        name: 'นางสาว ชุติมา เกษมสุข',
        focus: 'บริหารศูนย์ข้อมูลกลาง การวิเคราะห์ข้อมูล และระบบความปลอดภัยไซเบอร์',
        photo: '/images/personnel/demo-profile.svg'
      }
    ]
  },
  {
    position: 'รองปลัดฯ ฝ่ายบริการปฐมภูมิและจังหวัด',
    name: 'นพ. วิศิษฏ์ ศานติเสถียร',
    summary:
      'กำกับเครือข่ายโรงพยาบาลชุมชนและสถานีอนามัยทั่วประเทศ ประสานทรัพยากรตามบริบทพื้นที่และภัยพิบัติ',
    photo: '/images/personnel/demo-profile.svg',
    teams: [
      {
        position: 'ผอ. กองประสานบริการพื้นที่',
        name: 'นาง รจนา จิตร์ประเสริฐ',
        focus: 'เชื่อมโยงเขตสุขภาพ 13 เขตกับยุทธศาสตร์กระทรวงและจังหวัด',
        photo: '/images/personnel/demo-profile.svg'
      },
      {
        position: 'ผอ. ศูนย์สนับสนุนบริการเคลื่อนที่',
        name: 'นพ. วรเดช ปัญญาวุฒิ',
        focus: 'บริหารหน่วยแพทย์เคลื่อนที่และระบบตอบสนองเหตุฉุกเฉินในทุกพื้นที่',
        photo: '/images/personnel/demo-profile.svg'
      }
    ]
  },
  {
    position: 'รองปลัดฯ ฝ่ายทรัพยากรบุคคลและสนับสนุน',
    name: 'นาง นภารัตน์ อนทรชัย',
    summary:
      'เสริมสร้างศักยภาพบุคลากร ระบบสนับสนุน และธรรมาภิบาล เพื่อให้การบริการสุขภาพดำเนินไปอย่างยั่งยืน',
    photo: '/images/personnel/demo-profile.svg',
    teams: [
      {
        position: 'ผอ. กองพัฒนากำลังคนสุขภาพ',
        name: 'นาย ปริญญา สมจริง',
        focus: 'วางแผนกำลังคน การพัฒนาทักษะ และเส้นทางความก้าวหน้าของบุคลากร',
        photo: '/images/personnel/demo-profile.svg'
      },
      {
        position: 'ผอ. ศูนย์บริหารทรัพยากรและงบประมาณ',
        name: 'นาง จักรี ศรีหงษ์ทอง',
        focus: 'จัดการงบประมาณ การพัสดุ และระบบสนับสนุนส่วนกลาง',
        photo: '/images/personnel/demo-profile.svg'
      }
    ]
  }
];

const supportUnits = [
  {
    title: 'ศูนย์ข้อมูลกลาง',
    description:
      'โครงสร้างพื้นฐานด้านข้อมูลและ API กลาง สนับสนุนการแลกเปลี่ยนข้อมูลข้ามระบบและการวิเคราะห์เชิงนโยบาย'
  },
  {
    title: 'ทีมสื่อสารวิกฤต',
    description:
      'ดูแลการสื่อสารสาธารณะและการบริหารจัดการข่าวสาร ในภาวะฉุกเฉินและสถานการณ์สำคัญ'
  },
  {
    title: 'กองกฎหมายและธรรมาภิบาล',
    description:
      'ให้คำปรึกษากฎหมาย กำกับดูแลสัญญา และยกระดับความโปร่งใสในทุกขั้นตอนการดำเนินงาน'
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,106,61,0.12),_transparent_60%)]" />
          <div className="relative mx-auto max-w-6xl px-6">
            <SectionTitle
              title="โครงสร้างบุคลากร"
              subtitle="ผังการบังคับบัญชาในรูปแบบรากต้นไม้ แสดงความเชื่อมโยงระหว่างผู้บริหารและหน่วยงานสนับสนุน"
            />

            <div className="mt-16 flex flex-col items-center gap-20">
              <div className="flex flex-col items-center text-center">
                <div className="section-wrapper relative w-full max-w-3xl space-y-6 px-8 py-12">
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">ศูนย์กลางการบริหาร</span>
                  <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-8">
                    <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
                      <Image
                        src={leadership.photo}
                        alt={leadership.name}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-3 text-left">
                      <h3 className="text-2xl font-semibold text-neutral md:text-3xl">{leadership.name}</h3>
                      <p className="text-base font-medium text-primary">{leadership.position}</p>
                      <p className="text-sm leading-relaxed text-slate-600">{leadership.description}</p>
                      <div className="rounded-3xl border border-[#dbece1] bg-[#f4fbf6] px-6 py-4 text-sm text-slate-600">
                        <p className="font-semibold text-neutral">บทบาทสำคัญ</p>
                        <p className="mt-2 leading-relaxed">{leadership.focus}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-10 flex items-center justify-center">
                  <div className="h-16 w-px bg-gradient-to-b from-primary/40 via-primary/30 to-transparent" />
                </div>
              </div>

              <div className="relative w-full">
                <div className="pointer-events-none absolute left-0 right-0 top-0 hidden h-px -translate-y-10 bg-gradient-to-r from-transparent via-primary/20 to-transparent md:block" />
                <div className="grid gap-12 md:grid-cols-3">
                  {branches.map((branch) => (
                    <div key={branch.position} className="flex flex-col items-center gap-8 text-center md:text-left">
                      <div className="section-wrapper relative w-full space-y-4 px-6 py-8">
                        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-5">
                          <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md">
                            <Image
                              src={branch.photo}
                              alt={branch.name}
                              fill
                              sizes="96px"
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-2 text-left">
                            <h4 className="text-xl font-semibold text-neutral">{branch.name}</h4>
                            <p className="text-sm font-medium text-primary">{branch.position}</p>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-600">{branch.summary}</p>
                      </div>
                      <div className="flex w-full flex-col gap-6 border-l border-dashed border-primary/25 pl-6">
                        {branch.teams.map((team) => (
                          <div key={team.position} className="relative rounded-3xl border border-[#d7e9de] bg-white/80 px-5 py-5 shadow-sm">
                            <span className="absolute -left-[37px] top-1/2 hidden h-px w-9 -translate-y-1/2 bg-primary/20 md:block" />
                            <div className="flex items-start gap-4">
                              <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white shadow-sm">
                                <Image
                                  src={team.photo}
                                  alt={team.name}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="space-y-1 text-left">
                                <p className="text-sm font-semibold text-neutral">{team.name}</p>
                                <p className="text-xs font-medium text-primary/80">{team.position}</p>
                                <p className="mt-2 text-xs leading-relaxed text-slate-600">{team.focus}</p>
                              </div>
                            </div>
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
                  {supportUnits.map((support) => (
                    <div key={support.title} className="flex flex-col gap-3 text-left">
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
