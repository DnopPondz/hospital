'use client';

import { Fragment, useEffect, useState } from 'react';

import RichTextEditor from '@/components/RichTextEditor';

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

const createDefaultForm = () => ({
  slug: null,
  title: '',
  summary: '',
  content: '',
  date: '',
  displayFrom: '',
  displayUntil: '',
  image: null,
  existingImageUrl: null,
  removeImage: false
});

const createFileKey = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const typeLabels = {
  news: 'ข่าว',
  announcements: 'ประกาศ'
};

const typeDescriptions = {
  news: 'จัดการข่าวประชาสัมพันธ์ที่แสดงบนหน้า “ข่าว” และหน้าแรก',
  announcements: 'จัดการประกาศทางการสำหรับเผยแพร่ต่อประชาชน'
};

const typeEndpoints = {
  news: '/api/news',
  announcements: '/api/announcements'
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

function formatDateInput(value) {
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

  return `${year}-${month}-${day}`;
}

function getVisibilityState(item) {
  const now = Date.now();
  const startsAt = item.displayFrom ? new Date(item.displayFrom).getTime() : null;
  const endsAt = item.displayUntil ? new Date(item.displayUntil).getTime() : null;

  if (!item.published) {
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
  const [authenticated, setAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('news');
  const [items, setItems] = useState({ news: [], announcements: [] });
  const [formData, setFormData] = useState({ news: createDefaultForm(), announcements: createDefaultForm() });
  const [fileInputKeys, setFileInputKeys] = useState({ news: createFileKey(), announcements: createFileKey() });
  const [scheduleDrafts, setScheduleDrafts] = useState({ news: {}, announcements: {} });
  const [processingKey, setProcessingKey] = useState(null);
  const [editingSlug, setEditingSlug] = useState({ news: null, announcements: null });

  const fetchContent = async (type) => {
    const endpoint = typeEndpoints[type];
    try {
      const response = await fetch(endpoint, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลได้');
      }
      const data = await response.json();
      const list = Array.isArray(data) ? data : [];
      setItems((previous) => ({ ...previous, [type]: list }));
      setScheduleDrafts((previous) => ({
        ...previous,
        [type]: list.reduce((drafts, item) => {
          drafts[item.slug] = {
            displayFrom: formatDatetimeLocal(item.displayFrom),
            displayUntil: formatDatetimeLocal(item.displayUntil)
          };
          return drafts;
        }, {})
      }));
      return list;
    } catch (error) {
      setItems((previous) => ({ ...previous, [type]: [] }));
      setScheduleDrafts((previous) => ({ ...previous, [type]: {} }));
      return [];
    }
  };

  useEffect(() => {
    Promise.all([fetchContent('news'), fetchContent('announcements')]).finally(() => setLoading(false));

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
      await Promise.all([fetchContent('news'), fetchContent('announcements')]);
    } else {
      const data = await response.json();
      setFeedback({ type: 'error', message: data.message ?? 'ไม่สามารถเข้าสู่ระบบได้' });
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthenticated(false);
    setFeedback({ type: 'success', message: 'ออกจากระบบแล้ว' });
  };

  const resetFormForType = (type) => {
    setFormData((previous) => ({ ...previous, [type]: createDefaultForm() }));
    setFileInputKeys((previous) => ({ ...previous, [type]: createFileKey() }));
    setEditingSlug((previous) => ({ ...previous, [type]: null }));
  };

  const clearFileSelection = (type) => {
    setFormData((previous) => ({
      ...previous,
      [type]: { ...previous[type], image: null }
    }));
    setFileInputKeys((previous) => ({ ...previous, [type]: createFileKey() }));
  };

  const handleRemoveExistingImage = (type) => {
    setFormData((previous) => ({
      ...previous,
      [type]: { ...previous[type], image: null, removeImage: true }
    }));
  };

  const startEditing = (type, item) => {
    setActiveTab(type);
    setFormData((previous) => ({
      ...previous,
      [type]: {
        slug: item.slug,
        title: item.title ?? '',
        summary: item.summary ?? '',
        content: item.content ?? '',
        date: formatDateInput(item.date),
        displayFrom: formatDatetimeLocal(item.displayFrom),
        displayUntil: formatDatetimeLocal(item.displayUntil),
        image: null,
        existingImageUrl: item.imageUrl ?? null,
        removeImage: false
      }
    }));
    setFileInputKeys((previous) => ({ ...previous, [type]: createFileKey() }));
    setEditingSlug((previous) => ({ ...previous, [type]: item.slug }));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const cancelEditing = (type) => {
    resetFormForType(type);
  };

  const handleInlineImageUpload = async (file) => {
    const payload = new FormData();
    payload.set('image', file);

    const response = await fetch('/api/uploads', {
      method: 'POST',
      body: payload
    });

    if (!response.ok) {
      let message = 'ไม่สามารถอัปโหลดรูปภาพได้';
      try {
        const data = await response.json();
        message = data.message ?? message;
      } catch (error) {
        // ignore parsing error
      }
      setFeedback({ type: 'error', message });
      throw new Error(message);
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    const type = activeTab;
    const endpoint = typeEndpoints[type];
    const label = typeLabels[type];
    const currentForm = formData[type];
    const isEditing = Boolean(currentForm.slug);
    const requestUrl = isEditing ? `${endpoint}/${currentForm.slug}` : endpoint;
    const method = isEditing ? 'PUT' : 'POST';
    const processing = `form:${type}`;
    setProcessingKey(processing);

    const payload = new FormData();
    payload.set('title', currentForm.title);
    payload.set('summary', currentForm.summary);
    payload.set('content', currentForm.content || '');
    payload.set('date', currentForm.date ?? '');
    payload.set('displayFrom', currentForm.displayFrom ?? '');
    payload.set('displayUntil', currentForm.displayUntil ?? '');

    if (currentForm.image instanceof File && currentForm.image.size > 0) {
      payload.set('image', currentForm.image);
    } else if (isEditing && currentForm.removeImage) {
      payload.set('removeImage', 'true');
    }

    try {
      const response = await fetch(requestUrl, {
        method,
        body: payload
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? `ไม่สามารถ${isEditing ? 'อัปเดต' : 'บันทึก'}${label}ได้`);
      }

      resetFormForType(type);
      setFeedback({
        type: 'success',
        message: `${isEditing ? 'อัปเดต' : 'บันทึก'}${label}เรียบร้อยแล้ว`
      });
      await fetchContent(type);
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : `ไม่สามารถ${isEditing ? 'อัปเดต' : 'บันทึก'}${label}ได้`;
      setFeedback({ type: 'error', message });
    } finally {
      setProcessingKey(null);
    }
  };

  const handleToggleVisibility = async (type, slug, published) => {
    setFeedback(null);
    const endpoint = typeEndpoints[type];
    const label = typeLabels[type];
    const key = `${type}:${slug}`;
    setProcessingKey(key);

    const response = await fetch(`${endpoint}/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published })
    });

    if (response.ok) {
      setFeedback({ type: 'success', message: `${published ? 'เปิด' : 'ปิด'}การแสดง${label}เรียบร้อยแล้ว` });
      await fetchContent(type);
    } else {
      const data = await response.json();
      setFeedback({ type: 'error', message: data.message ?? `ไม่สามารถอัปเดตสถานะ${label}ได้` });
    }

    setProcessingKey(null);
  };

  const handleDelete = async (type, slug, title) => {
    const label = typeLabels[type];
    if (!window.confirm(`ยืนยันการลบ${label} “${title}” หรือไม่?`)) {
      return;
    }

    setFeedback(null);
    const endpoint = typeEndpoints[type];
    const key = `${type}:${slug}`;
    setProcessingKey(key);

    const response = await fetch(`${endpoint}/${slug}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      setFeedback({ type: 'success', message: `ลบ${label}เรียบร้อยแล้ว` });
      await fetchContent(type);
    } else {
      const data = await response.json();
      setFeedback({ type: 'error', message: data.message ?? `ไม่สามารถลบ${label}ได้` });
    }

    setProcessingKey(null);
  };

  const handleScheduleChange = (type, slug, field, value) => {
    setScheduleDrafts((previous) => ({
      ...previous,
      [type]: {
        ...previous[type],
        [slug]: {
          ...previous[type]?.[slug],
          [field]: value
        }
      }
    }));
  };

  const handleScheduleSubmit = async (event, type, slug) => {
    event.preventDefault();
    setFeedback(null);

    const endpoint = typeEndpoints[type];
    const label = typeLabels[type];
    const key = `${type}:${slug}`;
    setProcessingKey(key);

    const draft = scheduleDrafts[type]?.[slug] ?? {};
    const response = await fetch(`${endpoint}/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayFrom: draft.displayFrom || null,
        displayUntil: draft.displayUntil || null
      })
    });

    if (response.ok) {
      setFeedback({ type: 'success', message: `อัปเดตตารางเผยแพร่${label}เรียบร้อยแล้ว` });
      await fetchContent(type);
    } else {
      const data = await response.json();
      setFeedback({ type: 'error', message: data.message ?? `ไม่สามารถอัปเดตตารางเผยแพร่${label}ได้` });
    }

    setProcessingKey(null);
  };

  const activeItems = items[activeTab] ?? [];
  const currentForm = formData[activeTab];
  const currentDrafts = scheduleDrafts[activeTab] ?? {};
  const activeLabel = typeLabels[activeTab];
  const isEditingCurrent = Boolean(currentForm?.slug);
  const formProcessing = processingKey === `form:${activeTab}`;

  return (
    <div className="min-h-screen bg-[#e6efe9] py-16">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-10 shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral">ระบบจัดการข่าวและประกาศ</h1>
        <p className="mt-2 text-sm text-slate-500">เข้าสู่ระบบเพื่อเพิ่มหรือแก้ไขข่าวและประกาศบนหน้าเว็บไซต์หลัก</p>

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
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_-16px_rgba(16,185,129,0.65)] transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        ) : (
          <div className="mt-8 space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 text-sm font-semibold text-slate-600">
                {Object.entries(typeLabels).map(([type, label]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActiveTab(type)}
                    className={`rounded-full px-4 py-2 transition ${
                      activeTab === type ? 'bg-white text-primary shadow-sm' : 'hover:text-primary'
                    }`}
                  >
                    จัดการ{label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
              >
                ออกจากระบบ
              </button>
            </div>
            <p className="text-sm text-slate-500">{typeDescriptions[activeTab]}</p>

            <div className="overflow-hidden rounded-3xl border border-slate-100">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3">วันที่เผยแพร่</th>
                    <th className="px-4 py-3">หัวข้อ{activeLabel}</th>
                    <th className="px-4 py-3">สถานะ</th>
                    <th className="px-4 py-3">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-sm">
                  {loading && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                        กำลังโหลดข้อมูล...
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    activeItems.map((item) => {
                      const state = getVisibilityState(item);
                      const key = `${activeTab}:${item.slug}`;
                      const processing = processingKey === key;

                      return (
                        <Fragment key={item.slug}>
                          <tr>
                            <td className="px-4 py-3 text-slate-500">{formatThaiDate(item.date)}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col gap-1">
                                <span className="font-semibold text-neutral">{item.title}</span>
                                <span className="text-xs text-slate-500">{item.summary}</span>
                                {item.slug && (
                                  <a
                                    href={activeTab === 'news' ? `/news/${item.slug}` : `/announcements/${item.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-semibold text-primary hover:underline"
                                  >
                                    ดูบนเว็บไซต์หลัก
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${state.badge}`}>
                                <span className={`h-2 w-2 rounded-full ${state.dot}`} />
                                {state.label}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => startEditing(activeTab, item)}
                                  className="rounded-full border border-primary/40 bg-white px-3 py-1 font-semibold text-primary transition hover:bg-primary/10"
                                  disabled={processingKey === `form:${activeTab}`}
                                >
                                  แก้ไข
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleVisibility(activeTab, item.slug, !item.published)}
                                  className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
                                  disabled={processing || processingKey === `form:${activeTab}`}
                                >
                                  {item.published ? 'ปิดการแสดง' : 'เปิดการแสดง'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(activeTab, item.slug, item.title)}
                                  className="rounded-full border border-rose-200 px-3 py-1 font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
                                  disabled={processing || processingKey === `form:${activeTab}`}
                                >
                                  ลบ{activeLabel}
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
                                    {describeSchedule({ displayFrom: item.displayFrom, displayUntil: item.displayUntil })}
                                  </p>
                                </div>
                                <form
                                  onSubmit={(event) => handleScheduleSubmit(event, activeTab, item.slug)}
                                  className="flex flex-col gap-2 md:flex-row md:items-end"
                                >
                                  <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                    เริ่มแสดง
                                    <input
                                      type="datetime-local"
                                      value={currentDrafts[item.slug]?.displayFrom ?? ''}
                                      onChange={(event) => handleScheduleChange(activeTab, item.slug, 'displayFrom', event.target.value)}
                                      className="w-56 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                      disabled={processing}
                                    />
                                  </label>
                                  <label className="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                    สิ้นสุดแสดง
                                    <input
                                      type="datetime-local"
                                      value={currentDrafts[item.slug]?.displayUntil ?? ''}
                                      onChange={(event) => handleScheduleChange(activeTab, item.slug, 'displayUntil', event.target.value)}
                                      className="w-56 rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                      disabled={processing}
                                    />
                                  </label>
                                  <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_18px_-12px_rgba(16,185,129,0.6)] transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:opacity-60"
                                    disabled={processing}
                                  >
                                    บันทึกตาราง
                                  </button>
                                </form>
                              </div>
                            </td>
                          </tr>
                        </Fragment>
                      );
                    })}
                  {!loading && activeItems.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                        ยังไม่มี{activeLabel}ในระบบ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-neutral">
                  {isEditingCurrent ? `แก้ไข${activeLabel}` : `เพิ่ม${activeLabel}ใหม่`}
                </h2>
                {isEditingCurrent && (
                  <button
                    type="button"
                    onClick={() => cancelEditing(activeTab)}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:text-rose-500"
                    disabled={formProcessing}
                  >
                    ยกเลิกการแก้ไข
                  </button>
                )}
              </div>
              {isEditingCurrent && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  กำลังแก้ไข{activeLabel} “{currentForm.title || 'ไม่ระบุหัวข้อ'}”
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="title">
                  หัวข้อ{activeLabel}
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={currentForm.title}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      [activeTab]: { ...previous[activeTab], title: event.target.value }
                    }))
                  }
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
                  value={currentForm.summary}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      [activeTab]: { ...previous[activeTab], summary: event.target.value }
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor={`${activeTab}-image`}>
                  ภาพประกอบ{activeLabel} (ไม่บังคับ)
                </label>
                <input
                  key={fileInputKeys[activeTab]}
                  id={`${activeTab}-image`}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setFormData((previous) => ({
                      ...previous,
                      [activeTab]: { ...previous[activeTab], image: file, removeImage: false }
                    }));
                    if (!file) {
                      setFileInputKeys((previous) => ({ ...previous, [activeTab]: createFileKey() }));
                    }
                  }}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <p className="mt-2 text-xs text-slate-500">รองรับไฟล์ JPG, PNG หรือ WebP ขนาดไม่เกิน 5 MB</p>
                {currentForm.existingImageUrl && !currentForm.image && !currentForm.removeImage && (
                  <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
                    <span className="font-semibold text-slate-600">ภาพปัจจุบัน</span>
                    <img
                      src={currentForm.existingImageUrl}
                      alt={`ภาพประกอบ${activeLabel}เดิม`}
                      className="max-h-40 w-full rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(activeTab)}
                      className="self-start rounded-full border border-rose-200 px-3 py-1 font-semibold text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
                    >
                      ลบภาพปัจจุบัน
                    </button>
                    <p>หากต้องการเปลี่ยนรูป กรุณาเลือกไฟล์ใหม่หรือกดลบภาพปัจจุบัน</p>
                  </div>
                )}
                {currentForm.removeImage && currentForm.existingImageUrl && !currentForm.image && (
                  <div className="mt-3 flex items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-600">
                    <span>ระบบจะลบภาพประกอบเดิมเมื่อบันทึก</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((previous) => ({
                          ...previous,
                          [activeTab]: { ...previous[activeTab], removeImage: false }
                        }))
                      }
                      className="rounded-full border border-rose-200 bg-white px-3 py-1 font-semibold text-rose-600 transition hover:border-rose-300 hover:text-rose-500"
                    >
                      ยกเลิกการลบภาพ
                    </button>
                  </div>
                )}
                {currentForm.image && (
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>
                      ไฟล์ที่เลือก: {currentForm.image.name} ({Math.ceil(currentForm.image.size / 1024)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => clearFileSelection(activeTab)}
                      className="rounded-full border border-slate-200 px-2 py-1 font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
                    >
                      ลบไฟล์
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="content">
                  เนื้อหา{activeLabel}
                </label>
                <div className="mt-2">
                  <RichTextEditor
                    value={currentForm.content}
                    onChange={(html) =>
                      setFormData((previous) => ({
                        ...previous,
                        [activeTab]: { ...previous[activeTab], content: html }
                      }))
                    }
                    onUploadImage={handleInlineImageUpload}
                    placeholder={`พิมพ์เนื้อหา${activeLabel}ที่นี่...`}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="date">
                  วันที่เผยแพร่ (ไม่ระบุจะใช้วันที่วันนี้)
                </label>
                <input
                  id="date"
                  type="date"
                  value={currentForm.date}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      [activeTab]: { ...previous[activeTab], date: event.target.value }
                    }))
                  }
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
                  value={currentForm.displayFrom}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      [activeTab]: { ...previous[activeTab], displayFrom: event.target.value }
                    }))
                  }
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
                  value={currentForm.displayUntil}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      [activeTab]: { ...previous[activeTab], displayUntil: event.target.value }
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button
                type="submit"
                disabled={formProcessing}
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_-18px_rgba(16,185,129,0.65)] transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:opacity-60"
              >
                {formProcessing
                  ? 'กำลังบันทึก...'
                  : isEditingCurrent
                    ? `อัปเดต${activeLabel}`
                    : `บันทึก${activeLabel}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
