'use client';

import { useEffect, useState } from 'react';

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
  date: ''
};

export default function AdminPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

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

    const response = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
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

  return (
    <div className="min-h-screen bg-slate-100 py-16">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral">ระบบจัดการประกาศ</h1>
        <p className="mt-2 text-sm text-slate-500">เข้าสู่ระบบเพื่อเพิ่มหรือแก้ไขข่าวประกาศบนหน้าเว็บไซต์หลัก</p>

        {feedback && (
          <div
            className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
              feedback.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
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
                    <th className="px-4 py-3 text-left font-medium text-slate-600">ลิงก์</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {announcements.map((announcement) => (
                    <tr key={announcement.slug} className="bg-white">
                      <td className="px-4 py-3 text-slate-500">{formatThaiDate(announcement.date)}</td>
                      <td className="px-4 py-3 font-medium text-neutral">{announcement.title}</td>
                      <td className="px-4 py-3 text-primary">
                        <a href={`/announcements/${announcement.slug}`} target="_blank" rel="noopener noreferrer">
                          เปิดหน้า
                        </a>
                      </td>
                    </tr>
                  ))}
                  {announcements.length === 0 && !loading && (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-slate-400">
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
