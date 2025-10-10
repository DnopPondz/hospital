'use client';

import { Fragment, useEffect, useState } from 'react';

function formatThaiDate(value) {
  try {
    return new Intl.DateTimeFormat('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
}

const defaultForm = {
  title: '',
  summary: '',
  content: '',
  date: '',
  displayFrom: '',
  displayUntil: ''
};

function formatThaiDateTime(value) {
  try {
    return new Intl.DateTimeFormat('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
}

function formatDatetimeLocal(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getVisibilityState(announcement) {
  const now = Date.now();
  const startsAt = announcement.displayFrom ? new Date(announcement.displayFrom).getTime() : null;
  const endsAt = announcement.displayUntil ? new Date(announcement.displayUntil).getTime() : null;

  if (!announcement.published) {
    return {
      label: 'ปิดไว้',
      badge: 'bg-slate-100 text-slate-500',
      dot: 'bg-slate-400'
    };
  }

  if (startsAt && startsAt > now) {
    return {
      label: 'รอเริ่มเผยแพร่',
      badge: 'bg-amber-100 text-amber-700',
      dot: 'bg-amber-500'
    };
  }

  if (endsAt && endsAt < now) {
    return {
      label: 'หมดช่วงเผยแพร่',
      badge: 'bg-rose-100 text-rose-600',
      dot: 'bg-rose-500'
    };
  }

  return {
    label: 'กำลังเผยแพร่',
    badge: 'bg-[#e6f4ec] text-primary',
    dot: 'bg-accent'
  };
}

function describeSchedule({ displayFrom, displayUntil }) {
  if (!displayFrom && !displayUntil) {
    return 'แสดงทันทีโดยไม่กำหนดวันสิ้นสุด';
  }

  if (displayFrom && displayUntil) {
    return `แสดงตั้งแต่ ${formatThaiDateTime(displayFrom)} ถึง ${formatThaiDateTime(displayUntil)}`;
  }

  if (displayFrom) {
    return `แสดงตั้งแต่ ${formatThaiDateTime(displayFrom)} เป็นต้นไป`;
  }

  return `แสดงจนถึง ${formatThaiDateTime(displayUntil)}`;
}

export default function AdminPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [processingSlug, setProcessingSlug] = useState(null);
  const [scheduleDrafts, setScheduleDrafts] = useState({});

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลประกาศได้');
      }
      const data = await response.json();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (error) {
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    fetchAnnouncements().finally(() => setLoading(false));

    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => setAuthenticated(Boolean(data.authenticated)))
      .catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    const nextDrafts = {};
    announcements.forEach((announcement) => {
      nextDrafts[announcement.slug] = {
        displayFrom: formatDatetimeLocal(announcement.displayFrom),
        displayUntil: formatDatetimeLocal(announcement.displayUntil)
      };
    });
    setScheduleDrafts(nextDrafts);
  }, [announcements]);

  const handleLogin = async (event) => {
    event.preventDefault();

    setFeedback(null);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (response.ok) {
      setAuthenticated(true);
      setCredentials({ username: '', password: '' });
      setFeedback({ type: 'success', message: 'เข้าสู่ระบบสำเร็จ' });
      await fetchAnnouncements();
    } else {
      const data = await response.json();
      setFeedback({ type: 'error', message: data.message ?? 'ไม่สามารถเข้าสู่ระบบได้' });
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthenticated(false);
    setFeedback({ type: 'success', message: 'ออกจากระบบแล้ว' });
    await fetchAnnouncements();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    const payload = {
      ...formData,
      date: formData.date || null,
      displayFrom: formData.displayFrom || null,
      displayUntil: formData.displayUntil || null
    };

    const response = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      setFormData(defaultForm);
      setFeedback({ type: 'success', message: 'บันทึกประกาศใหม่เรียบร้อยแล้ว' });
      await fetchAnnouncements();
    } else {
      const data = await response.json();
      setFeedback({ type: 'error', message: data.message ?? 'ไม่สามารถบันทึกประกาศได้' });
    }
  };

  const handleToggleVisibility = async (slug, published) => {
    setFeedback(null);
    setProcessingSlug(slug);

    const response = await fetch(`/api/announcements/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published })
    });

    if (response.ok) {
      setFeedback({
        type: 'success',
        message: published ? 'เปิดการแสดงประกาศเรียบร้อยแล้ว' : 'ปิดการแสดงประกาศเรียบร้อยแล้ว'
      });
      await fetchAnnouncements();
    } else {
      const data = await response.json();
      setFeedback({ type: 'error', message: data.message ?? 'ไม่สามารถอัปเดตสถานะประกาศได้' });
    }

    setProcessingSlug(null);
  };

  const handleDeleteAnnouncement = async (slug, title) => {
    if (!window.confirm(`ยืนยันการลบประกาศ “${title}” หรือไม่?`)) {
      return;
    }

    setFeedback(null);
    setProcessingSlug(slug);

    const response = await fetch(`/api/announcements/${slug}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      setFeedback({ type: 'success', message: 'ลบประกาศเรียบร้อยแล้ว' });
      await fetchAnnouncements();
    } else {
      const data = await response.json();
      setFeedback({ type: 'error', message: data.message ?? 'ไม่สามารถลบประกาศได้' });
    }

    setProcessingSlug(null);
  };

  const handleScheduleChange = (slug, field, value) => {
    setScheduleDrafts((previous) => ({
      ...previous,
      [slug]: {
        ...previous[slug],
        [field]: value
      }
    }));
  };

  const handleScheduleSubmit = async (event, slug) => {
    event.preventDefault();
    setFeedback(null);
    setProcessingSlug(slug);

    const draft = scheduleDrafts[slug] ?? {};
    const response = await fetch(`/api/announcements/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayFrom: draft.displayFrom || null,
        displayUntil: draft.displayUntil || null
      })
    });

    if (response.ok) {
      setFeedback({ type: 'success', message: 'อัปเดตตารางเผยแพร่เรียบร้อยแล้ว' });
      await fetchAnnouncements();
    } else {
      const data = await response.json();
      setFeedback({ type: 'error', message: data.message ?? 'ไม่สามารถอัปเดตตารางเผยแพร่ได้' });
    }

    setProcessingSlug(null);
  };

  return (
    <div className="min-h-screen bg-[#e6efe9] py-16">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral">ระบบจัดการประกาศ</h1>
        <p className="mt-2 text-sm text-slate-500">เข้าสู่ระบบเพื่อเพิ่มหรือแก้ไขข่าวประกาศบนหน้าเว็บไซต์หลัก</p>

        {feedback && (
          <div
            className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
              feedback.type === 'success'
                ? 'border-[#c7e2d1] bg-[#eef7f1] text-primary'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {!authenticated ? (
          <form onSubmit={handleLogin} className="mt-8 grid gap-4 md:max-w-md">
            <div>
              <label className="text-sm font-medium text-slate-600" htmlFor="username">
                ชื่อผู้ใช้
              </label>
              <input
                id="username"
                type="text"
                required
                value={credentials.username}
                onChange={(event) => setCredentials((prev) => ({ ...prev, username: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600" htmlFor="password">
                รหัสผ่าน
              </label>
              <input
                id="password"
                type="password"
                required
                value={credentials.password}
                onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        ) : (
          <div className="mt-8 space-y-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-neutral">ประกาศล่าสุด</h2>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-rose-300 hover:text-rose-600"
              >
                ออกจากระบบ
              </button>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">วันที่</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">หัวข้อ</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">สถานะ</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {announcements.map((announcement) => (
                    <Fragment key={announcement.slug}>
                      <tr className="bg-white">
                        <td className="px-4 py-3 text-slate-500">{formatThaiDate(announcement.date)}</td>
                        <td className="px-4 py-3 font-medium text-neutral">
                          <div className="flex flex-col">
                            <span>{announcement.title}</span>
                            {announcement.published ? (
                              <a
                                href={`/announcements/${announcement.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 text-xs font-semibold text-primary"
                              >
                                เปิดหน้าในแท็บใหม่
                              </a>
                            ) : (
                              <span className="mt-1 text-xs font-semibold text-slate-400">ยังไม่เผยแพร่</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {(() => {
                            const state = getVisibilityState(announcement);
                            return (
                              <span
                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${state.badge}`}
                              >
                                <span className={`h-2 w-2 rounded-full ${state.dot}`} />
                                {state.label}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => handleToggleVisibility(announcement.slug, !announcement.published)}
                              className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
                              disabled={processingSlug === announcement.slug}
                            >
                              {announcement.published ? 'ปิดการแสดง' : 'เปิดการแสดง'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAnnouncement(announcement.slug, announcement.title)}
                              className="rounded-full border border-rose-200 px-3 py-1 font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
                              disabled={processingSlug === announcement.slug}
                            >
                              ลบประกาศ
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td colSpan={4} className="px-4 py-4 text-xs text-slate-600">
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="font-semibold text-slate-700">ตารางเผยแพร่</p>
                              <p className="mt-1 text-slate-500">
                                {describeSchedule({
                                  displayFrom: announcement.displayFrom,
                                  displayUntil: announcement.displayUntil
                                })}
                              </p>
                            </div>
                            <form
                              onSubmit={(event) => handleScheduleSubmit(event, announcement.slug)}
                              className="flex flex-col gap-2 md:flex-row md:items-end"
                            >
                              <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                เริ่มแสดง
                                <input
                                  type="datetime-local"
                                  value={scheduleDrafts[announcement.slug]?.displayFrom ?? ''}
                                  onChange={(event) =>
                                    handleScheduleChange(announcement.slug, 'displayFrom', event.target.value)
                                  }
                                  className="w-56 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                  disabled={processingSlug === announcement.slug}
                                />
                              </label>
                              <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                สิ้นสุดแสดง
                                <input
                                  type="datetime-local"
                                  value={scheduleDrafts[announcement.slug]?.displayUntil ?? ''}
                                  onChange={(event) =>
                                    handleScheduleChange(announcement.slug, 'displayUntil', event.target.value)
                                  }
                                  className="w-56 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                  disabled={processingSlug === announcement.slug}
                                />
                              </label>
                              <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral disabled:opacity-60"
                                disabled={processingSlug === announcement.slug}
                              >
                                บันทึกตาราง
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                  {announcements.length === 0 && !loading && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                        ยังไม่มีประกาศในระบบ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-semibold text-neutral">เพิ่มประกาศใหม่</h2>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="title">
                  หัวข้อประกาศ
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="summary">
                  สรุปเนื้อหา (แสดงบนหน้าแรก)
                </label>
                <textarea
                  id="summary"
                  required
                  rows={3}
                  value={formData.summary}
                  onChange={(event) => setFormData((prev) => ({ ...prev, summary: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="content">
                  เนื้อหาประกาศ
                </label>
                <textarea
                  id="content"
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(event) => setFormData((prev) => ({ ...prev, content: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="date">
                  วันที่เผยแพร่ (ไม่ระบุจะใช้วันที่วันนี้)
                </label>
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(event) => setFormData((prev) => ({ ...prev, date: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="displayFrom">
                  ตั้งเวลาเริ่มแสดง (ไม่ระบุจะแสดงทันที)
                </label>
                <input
                  id="displayFrom"
                  type="datetime-local"
                  value={formData.displayFrom}
                  onChange={(event) => setFormData((prev) => ({ ...prev, displayFrom: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="displayUntil">
                  ตั้งเวลาสิ้นสุดการแสดง (ไม่ระบุจะแสดงต่อเนื่อง)
                </label>
                <input
                  id="displayUntil"
                  type="datetime-local"
                  value={formData.displayUntil}
                  onChange={(event) => setFormData((prev) => ({ ...prev, displayUntil: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral"
              >
                บันทึกประกาศ
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
