const menuItems = [
  { href: '#services', label: 'บริการประชาชน' },
  { href: '#news', label: 'ข่าวประกาศ' },
  { href: '#digital', label: 'ศูนย์บริการดิจิทัล' },
  { href: '#contact', label: 'ติดต่อเรา' }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
            รช
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-primary/70">ราชการดิจิทัล</p>
            <p className="text-lg font-semibold text-neutral">สำนักงานราชการกลาง</p>
          </div>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-neutral md:flex">
          {menuItems.map((item) => (
            <a key={item.href} href={item.href} className="relative transition hover:text-primary">
              {item.label}
              <span className="absolute bottom-[-8px] left-0 h-[2px] w-0 bg-primary transition-all duration-300 ease-in-out hover:w-full" />
            </a>
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
