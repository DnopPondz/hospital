import Image from 'next/image';
import Link from 'next/link';

const menuItems = [
  { href: '/structure', label: 'โครงสร้างบุคลากร' },
  { href: '#services', label: 'บริการประชาชน' },
  { href: '#news', label: 'ข่าวประกาศ' },
  { href: '#digital', label: 'ศูนย์บริการดิจิทัล' },
  { href: '#contact', label: 'ติดต่อเรา' }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#c3d9cc] bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-[#d8e7de] bg-white shadow-sm">
            <Image src="/moph-logo.svg" alt="ตรากระทรวงสาธารณสุข" fill priority sizes="48px" className="object-contain p-1.5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-primary/70">Ministry of Public Health</p>
            <p className="text-lg font-semibold text-neutral">สำนักงานราชการกลาง</p>
          </div>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-neutral md:flex">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="group relative transition hover:text-primary">
              {item.label}
              <span className="pointer-events-none absolute bottom-[-8px] left-0 h-[2px] w-0 bg-primary transition-all duration-300 ease-in-out group-hover:w-full" />
            </Link>
          ))}
        </nav>
        {/* <a
          href="#contact"
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-neutral"
        >
          เข้าสู่ระบบบริการ
        </a> */}
      </div>
    </header>
  );
}
