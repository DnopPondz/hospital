export default function StatCard({ value, label }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 text-center shadow-sm">
      <p className="text-3xl font-semibold text-primary md:text-4xl">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{label}</p>
    </div>
  );
}
