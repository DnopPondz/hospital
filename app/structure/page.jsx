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

function PersonnelNode({ person, level }) {
  const sizeOptions = [
    { container: 'h-32 w-32 border-4', sizes: '128px' },
    { container: 'h-24 w-24 border-[3px]', sizes: '96px' },
    { container: 'h-20 w-20 border-2', sizes: '80px' }
  ];

  const cardBase = 'section-wrapper relative flex w-full flex-col items-center gap-5 text-center md:text-left';
  const cardByLevel = [
    'max-w-xl px-8 py-10 md:flex md:items-start md:gap-6 md:text-left',
    'max-w-sm px-6 py-8',
    'max-w-xs px-5 py-6'
  ];

  const { container, sizes } = sizeOptions[level] ?? sizeOptions[2];
  const description = person.description || person.summary;

  return (
    <div className={`${cardBase} ${cardByLevel[level] ?? cardByLevel[2]}`}>
      <div className={`relative overflow-hidden rounded-full border-white bg-white/40 shadow-lg ${container}`}>
        <Image
          src={person.photo}
          alt={person.name}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
      <div className="space-y-1 md:flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">{person.position}</p>
        <h3 className="text-lg font-semibold text-neutral md:text-xl">{person.name}</h3>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
        ) : null}
        {person.focus && level === 0 ? (
          <div className="mt-5 rounded-3xl border border-[#d7eadf] bg-[#f4fbf6] px-6 py-4 text-left text-sm leading-relaxed text-slate-600">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">บทบาทสำคัญ</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{person.focus}</p>
          </div>
        ) : null}
        {person.focus && level > 0 && !description ? (
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{person.focus}</p>
        ) : null}
      </div>
    </div>
  );
}

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
              subtitle="ผังบังคับบัญชาเชื่อมต่อกันด้วยเส้นสายแบบรากไม้ แสดงทีมบริหารหลักและหน่วยปฏิบัติการสำคัญ"
            />

            <div className="mt-16 flex justify-center">
              <div className="org-tree w-full" style={{ '--tree-line': '#c5e0ce' }}>
                <ul>
                  <li>
                    <div className="flex flex-col items-center">
                      <PersonnelNode person={leadership} level={0} />
                    </div>
                    <ul>
                      {branches.map((branch) => (
                        <li key={branch.position}>
                          <PersonnelNode person={branch} level={1} />
                          <ul>
                            {branch.teams.map((team) => (
                              <li key={team.position}>
                                <PersonnelNode person={team} level={2} />
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-24 flex flex-col items-center">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-primary/80">หน่วยสนับสนุนร่วมงาน</h4>
              <div className="mt-8 w-full max-w-5xl">
                <div className="section-wrapper grid gap-6 px-8 py-10 md:grid-cols-3">
                  {supportUnits.map((support) => (
                    <div key={support.title} className="flex flex-col gap-3 text-left">
                      <h5 className="text-base font-semibold text-neutral">{support.title}</h5>
                      <p className="text-sm leading-relaxed text-slate-600">{support.description}</p>
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
