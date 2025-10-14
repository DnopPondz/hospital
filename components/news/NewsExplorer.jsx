'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import {
  deriveFilterOptions,
  filterNewsItems,
  formatThaiDate,
  groupNewsByMonth,
  importanceLabel
} from '@/lib/news-helpers';

const IMPORTANCE_OPTIONS = [
  { value: 'all', label: 'ทุกระดับความสำคัญ' },
  { value: 'urgent', label: 'เร่งด่วน' },
  { value: 'high', label: 'สำคัญ' },
  { value: 'standard', label: 'ทั่วไป' }
];

function Pill({ children, tone = 'default' }) {
  const toneClass =
    tone === 'accent'
      ? 'bg-primary/10 text-primary border-primary/20'
      : tone === 'warning'
        ? 'bg-amber-100 text-amber-900 border-amber-200'
        : 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${toneClass}`}>
      {children}
    </span>
  );
}

export default function NewsExplorer({ newsItems }) {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    province: 'all',
    importance: 'all',
    tag: 'all'
  });

  const options = useMemo(() => deriveFilterOptions(newsItems), [newsItems]);

  const filteredNews = useMemo(() => filterNewsItems(newsItems, filters), [newsItems, filters]);
  const grouped = useMemo(() => groupNewsByMonth(filteredNews), [filteredNews]);

  const categoryOptions = useMemo(
    () => [{ value: 'all', label: 'ทุกหมวดหมู่' }, ...options.categories.map((value) => ({ value, label: value }))],
    [options.categories]
  );

  const provinceOptions = useMemo(
    () => [{ value: 'all', label: 'ทุกพื้นที่' }, ...options.provinces.map((value) => ({ value, label: value }))],
    [options.provinces]
  );

  const tagOptions = useMemo(
    () => [{ value: 'all', label: 'ทุกแท็ก' }, ...options.tags.map((value) => ({ value, label: value }))],
    [options.tags]
  );

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="rounded-3xl border border-[#dcece2] bg-white/90 p-8 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="mx-auto max-w-3xl text-left lg:text-left">
              <h2 className="text-2xl font-semibold text-neutral md:text-3xl">คลังข่าวพร้อมเครื่องมือค้นหา</h2>
              <p className="mt-3 text-base text-slate-600">
                กรองข่าวตามหมวด จังหวัด ระดับความสำคัญ หรือคีย์เวิร์ดที่คุณสนใจ
              </p>
              <div className="mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-accent" />
            </div>
            <p className="text-sm text-slate-600">
              ระบบจะคงค่าที่เลือกไว้และนับจำนวนข่าวที่ตรงเงื่อนไขโดยอัตโนมัติ เพื่อช่วยให้ทีมประชาสัมพันธ์เตรียมข้อมูลสำหรับเผยแพร่ต่อได้รวดเร็วขึ้น
            </p>
          </div>
          <div className="w-full max-w-lg space-y-3">
            <label className="block text-sm font-medium text-slate-700" htmlFor="news-search">
              ค้นหาข่าว
            </label>
            <input
              id="news-search"
              type="search"
              placeholder="ค้นหาจากหัวข้อ สรุป หรือเนื้อหา"
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterSelect
            label="หมวดหมู่"
            options={categoryOptions}
            value={filters.category}
            onChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
          />
          <FilterSelect
            label="พื้นที่"
            options={provinceOptions}
            value={filters.province}
            onChange={(value) => setFilters((prev) => ({ ...prev, province: value }))}
          />
          <FilterSelect
            label="ระดับความสำคัญ"
            options={IMPORTANCE_OPTIONS}
            value={filters.importance}
            onChange={(value) => setFilters((prev) => ({ ...prev, importance: value }))}
          />
          <FilterSelect
            label="แท็กข่าว"
            options={tagOptions}
            value={filters.tag}
            onChange={(value) => setFilters((prev) => ({ ...prev, tag: value }))}
          />
        </div>

        <ActiveFilters filters={filters} setFilters={setFilters} hasResults={filteredNews.length > 0} />

        <div className="mt-10 space-y-10">
          {grouped.length === 0 ? (
            <EmptyState />
          ) : (
            grouped.map((group) => (
              <div key={group.key} className="space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-2xl font-semibold text-neutral">{group.month}</h2>
                  <span className="text-sm text-primary/80">ข่าวที่ตรงเงื่อนไข {group.items.length} เรื่อง</span>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                  {group.items.map((newsItem) => (
                    <article key={newsItem.slug} className="flex h-full flex-col justify-between rounded-3xl border border-[#dcece2] bg-white/95 p-6 shadow-sm">
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Pill tone={newsItem.importance === 'urgent' ? 'warning' : newsItem.importance === 'high' ? 'accent' : 'default'}>
                            {importanceLabel(newsItem.importance)}
                          </Pill>
                          <Pill>{newsItem.category}</Pill>
                          <Pill>{newsItem.province}</Pill>
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                          {formatThaiDate(newsItem.date)}
                        </p>
                        <h3 className="text-lg font-semibold text-neutral">{newsItem.title}</h3>
                        <p className="text-sm leading-6 text-slate-600">{newsItem.summary}</p>
                      </div>
                      <div className="mt-6 flex flex-col gap-4">
                        {newsItem.tags?.length ? (
                          <div className="flex flex-wrap gap-2">
                            {newsItem.tags.map((tag) => (
                              <Pill key={tag} tone="accent">
                                #{tag}
                              </Pill>
                            ))}
                          </div>
                        ) : null}
                        <Link href={`/news/${newsItem.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                          อ่านรายละเอียดเพิ่มเติม <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function FilterSelect({ label, options, value, onChange }) {
  return (
    <label className="space-y-2 text-sm text-slate-600">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <select
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ActiveFilters({ filters, setFilters, hasResults }) {
  const hasActiveFilter = useMemo(() => {
    return (
      filters.search.trim() !== '' ||
      filters.category !== 'all' ||
      filters.province !== 'all' ||
      filters.importance !== 'all' ||
      filters.tag !== 'all'
    );
  }, [filters]);

  if (!hasActiveFilter) {
    return null;
  }

  const resetFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: key === 'search' ? '' : 'all' }));
  };

  return (
    <div className="mt-8 rounded-2xl bg-[#f4faf6] p-4 text-sm text-slate-600">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">ตัวกรองที่เลือก</span>
        {filters.search.trim() !== '' ? (
          <ActiveFilterPill label={`ค้นหา: ${filters.search}`} onRemove={() => resetFilter('search')} />
        ) : null}
        {filters.category !== 'all' ? (
          <ActiveFilterPill label={`หมวดหมู่: ${filters.category}`} onRemove={() => resetFilter('category')} />
        ) : null}
        {filters.province !== 'all' ? (
          <ActiveFilterPill label={`พื้นที่: ${filters.province}`} onRemove={() => resetFilter('province')} />
        ) : null}
        {filters.importance !== 'all' ? (
          <ActiveFilterPill label={`ความสำคัญ: ${IMPORTANCE_OPTIONS.find((option) => option.value === filters.importance)?.label ?? filters.importance}`} onRemove={() => resetFilter('importance')} />
        ) : null}
        {filters.tag !== 'all' ? (
          <ActiveFilterPill label={`แท็ก: ${filters.tag}`} onRemove={() => resetFilter('tag')} />
        ) : null}
        <button
          type="button"
          onClick={() =>
            setFilters({
              search: '',
              category: 'all',
              province: 'all',
              importance: 'all',
              tag: 'all'
            })
          }
          className="ml-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-3 py-1 text-xs font-medium text-primary shadow-sm hover:border-primary"
        >
          ล้างทั้งหมด
        </button>
      </div>
      {!hasResults ? <p className="mt-3 text-xs text-amber-600">ไม่พบข่าวที่ตรงกับเงื่อนไข ลองปรับตัวกรองหรือล้างทั้งหมด</p> : null}
    </div>
  );
}

function ActiveFilterPill({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow">
      {label}
      <button type="button" onClick={onRemove} className="text-slate-400 transition hover:text-primary" aria-label="นำตัวกรองออก">
        ×
      </button>
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-10 py-16 text-center text-slate-500">
      <h3 className="text-lg font-semibold text-neutral">ไม่พบข่าวตามเงื่อนไขที่เลือก</h3>
      <p className="mt-3 max-w-xl text-sm">
        กรุณาปรับตัวกรองหรือค้นหาใหม่ หากต้องการดูข่าวทั้งหมดให้กดปุ่ม "ล้างทั้งหมด" เพื่อกลับไปยังค่าตั้งต้น
      </p>
    </div>
  );
}
