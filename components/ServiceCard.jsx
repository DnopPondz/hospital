'use client';

import { useEffect, useState } from 'react';

export default function ServiceCard({ icon, title, description, details }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const { paragraphs = [], highlights = [], footer } = details ?? {};
  const modalId = `service-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <>
      <div className="group flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white">
          <span className="text-xl">{icon}</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-neutral">{title}</h3>
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-left text-sm font-semibold text-primary transition hover:text-neutral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          ดูรายละเอียด
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl bg-white/80 p-8 shadow-2xl ring-1 ring-black/5"
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalId}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-inner">
                  <span className="text-xl">{icon}</span>
                </div>
                <div>
                  <h3 id={modalId} className="text-xl font-semibold text-neutral">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">บริการพร้อมรายละเอียดการใช้งานและขั้นตอนอย่างละเอียด</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-slate-200 bg-white/70 p-2 text-slate-500 shadow-sm transition hover:border-transparent hover:bg-slate-100 hover:text-neutral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="ปิดหน้าต่างรายละเอียด"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 max-h-[60vh] space-y-6 overflow-y-auto pr-1 text-sm leading-7 text-slate-600">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-sm leading-7 text-slate-600">
                  {paragraph}
                </p>
              ))}

              {highlights.length > 0 && (
                <div className="rounded-2xl bg-sky-50/70 p-5 text-slate-600 shadow-inner">
                  <h4 className="text-sm font-semibold text-primary">หัวข้อสำคัญที่ควรรู้</h4>
                  <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-6 text-slate-600">
                    {highlights.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {footer && <p className="text-sm leading-7 text-slate-600">{footer}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
