import Link from 'next/link';

const quickLinks = [
  'คู่มือประชาชน',
  'เว็บไซต์กระทรวง',
  'ข้อมูลเปิดภาครัฐ',
  'ร้องเรียน-เสนอแนะ'
];

const contactInfo = [
  'โทรศัพท์กลาง 1111',
  'อีเมล contact@gov.th',
  'เปิดทำการ จันทร์-ศุกร์ 08:30 - 16:30 น.'
];

export default function Footer() {
  return (
    <footer className="bg-neutral text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">สำนักงานราชการกลาง</p>
            <p className="mt-1 text-2xl font-bold text-white">ศูนย์กลางบริการประชาชนแบบครบวงจร</p>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-300">
            มุ่งให้บริการด้วยความโปร่งใส เชื่อมโยงข้อมูลภาครัฐทุกมิติ เพื่อให้ประชาชนเข้าถึงสิทธิและสวัสดิการอย่างสะดวกและรวดเร็ว
            พร้อมยกระดับคุณภาพชีวิตด้วยนวัตกรรมดิจิทัล
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white border-b border-white/10 pb-4 mb-6">บริการยอดนิยม</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            {quickLinks.map((item) => (
              <li key={item}>
                <Link href="#" className="hover:text-accent transition-colors duration-200 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-accent/50"></span>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white border-b border-white/10 pb-4 mb-6">ข้อมูลติดต่อ</h3>
          <ul className="space-y-4 text-sm text-slate-300">
            {contactInfo.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <svg className="h-5 w-5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} สำนักดิจิทัลภาครัฐ. สงวนลิขสิทธิ์.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</Link>
            <Link href="#" className="hover:text-white transition-colors">ข้อตกลงการใช้งาน</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
