import Image from 'next/image';
import Link from 'next/link';

const menuItems = [
  { href: '/', label: 'หน้าแรก' },
  { href: '/services', label: 'บริการประชาชน' },
  { href: '/news', label: 'ข่าวประกาศ' },
  { href: '/digital', label: 'ศูนย์บริการดิจิทัล' },
  { href: '/contact', label: 'ติดต่อเรา' },
  { href: '/structure', label: 'โครงสร้างบุคลากร' }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-10 overflow-hidden rounded-full shadow-sm ring-1 ring-slate-100">
            <Image src="/moph-logo.svg" alt="ตรากระทรวงสาธารณสุข" fill priority sizes="40px" className="object-contain p-1" />
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Ministry of Public Health</p>
            <p className="text-lg font-bold text-neutral leading-tight">สำนักงานราชการกลาง</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="group relative py-2 transition hover:text-primary">
              {item.label}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 ease-out group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
             <Link
              href="/contact"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 hover:shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              ติดต่อเจ้าหน้าที่
            </Link>
        </div>
      </div>
    </header>
  );
}
