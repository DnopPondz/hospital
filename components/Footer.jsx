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
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-primary/70">สำนักงานราชการกลาง</p>
          <p className="text-lg font-semibold text-neutral">ศูนย์กลางบริการประชาชนแบบครบวงจร</p>
          <p className="text-sm text-slate-600">
            มุ่งให้บริการด้วยความโปร่งใส เชื่อมโยงข้อมูลภาครัฐทุกมิติ เพื่อให้ประชาชนเข้าถึงสิทธิและสวัสดิการอย่างสะดวกและรวดเร็ว
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral">บริการยอดนิยม</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {quickLinks.map((item) => (
              <li key={item} className="hover:text-primary">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral">ข้อมูลติดต่อ</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {contactInfo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-slate-500">© {new Date().getFullYear()} สำนักดิจิทัลภาครัฐ. สงวนลิขสิทธิ์.</p>
        </div>
      </div>
    </footer>
  );
}
