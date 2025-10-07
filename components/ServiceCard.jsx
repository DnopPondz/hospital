export default function ServiceCard({ icon, title, description, link }) {
  return (
    <div className="group flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white">
        <span className="text-xl">{icon}</span>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-neutral">{title}</h3>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </div>
      <a href={link} className="text-sm font-semibold text-primary transition group-hover:text-neutral">
        ดูรายละเอียด
      </a>
    </div>
  );
}
