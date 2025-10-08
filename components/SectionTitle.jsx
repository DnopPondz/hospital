export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-2xl font-semibold text-neutral md:text-3xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base text-slate-600">{subtitle}</p>}
      <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-accent" />
    </div>
  );
}
