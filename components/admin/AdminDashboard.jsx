'use client';

import { useEffect, useMemo, useState } from 'react';

const emptyForm = {
  title: '',
  summary: '',
  content: '',
  date: '',
  displayFrom: '',
  displayUntil: '',
  imageUrl: ''
};

function toInputValue(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 16);
}

function toIsoString(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function formatThaiDateTime(value) {
  if (!value) {
    return '-';
  }

  try {
    return new Intl.DateTimeFormat('th-TH', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
}

function createEditState(items) {
  return items.reduce((acc, item) => {
    acc[item.slug] = {
      displayFrom: toInputValue(item.displayFrom),
      displayUntil: toInputValue(item.displayUntil)
    };
    return acc;
  }, {});
}

async function uploadImage(file, setLoadingState) {
  const key = 'upload';
  setLoadingState(key, true);
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/uploads', {
      method: 'POST',
      body: formData
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload?.message || 'ไม่สามารถอัปโหลดรูปภาพได้');
    }

    return payload.url;
  } finally {
    setLoadingState(key, false);
  }
}

export default function AdminDashboard() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('news');

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [newsItems, setNewsItems] = useState([]);
  const [announcementItems, setAnnouncementItems] = useState([]);
  const [newsEdits, setNewsEdits] = useState({});
  const [announcementEdits, setAnnouncementEdits] = useState({});

  const [newsForm, setNewsForm] = useState(emptyForm);
  const [announcementForm, setAnnouncementForm] = useState(emptyForm);
  const [newsEditingSlug, setNewsEditingSlug] = useState(null);
  const [announcementEditingSlug, setAnnouncementEditingSlug] = useState(null);

  const [newsMessage, setNewsMessage] = useState('');
  const [newsError, setNewsError] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementError, setAnnouncementError] = useState('');

  const [loadingMap, setLoadingMap] = useState({});

  const isLoading = (key) => Boolean(loadingMap[key]);
  const setLoadingState = (key, value) => {
    setLoadingMap((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' });
        const payload = await response.json();
        setAuthenticated(Boolean(payload?.authenticated));
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();
  }, []);

  useEffect(() => {
    if (!authenticated) {
      setNewsItems([]);
      setAnnouncementItems([]);
      return;
    }

    async function fetchCollections() {
      try {
        const [newsResponse, announcementResponse] = await Promise.all([
          fetch('/api/news', { cache: 'no-store' }),
          fetch('/api/announcements', { cache: 'no-store' })
        ]);

        const [newsData, announcementData] = await Promise.all([
          newsResponse.json(),
          announcementResponse.json()
        ]);

        setNewsItems(Array.isArray(newsData) ? newsData : []);
        setAnnouncementItems(Array.isArray(announcementData) ? announcementData : []);
        setNewsEdits(createEditState(Array.isArray(newsData) ? newsData : []));
        setAnnouncementEdits(createEditState(Array.isArray(announcementData) ? announcementData : []));
      } catch (error) {
        setNewsItems([]);
        setAnnouncementItems([]);
      }
    }

    fetchCollections();
  }, [authenticated]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError('');
    setLoadingState('login', true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || 'ไม่สามารถเข้าสู่ระบบได้');
      }

      setAuthenticated(true);
      setLoginForm({ username: '', password: '' });
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoadingState('login', false);
    }
  };

  const handleLogout = async () => {
    setLoadingState('logout', true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setAuthenticated(false);
      setLoadingState('logout', false);
    }
  };

  const resetForms = () => {
    setNewsForm(emptyForm);
    setAnnouncementForm(emptyForm);
    setNewsEditingSlug(null);
    setAnnouncementEditingSlug(null);
  };

  const handleSubmit = async (event, type) => {
    event.preventDefault();

    const isNews = type === 'news';
    const formState = isNews ? newsForm : announcementForm;
    const setFormState = isNews ? setNewsForm : setAnnouncementForm;
    const setItems = isNews ? setNewsItems : setAnnouncementItems;
    const setEdits = isNews ? setNewsEdits : setAnnouncementEdits;
    const setMessage = isNews ? setNewsMessage : setAnnouncementMessage;
    const setError = isNews ? setNewsError : setAnnouncementError;
    const editingSlug = isNews ? newsEditingSlug : announcementEditingSlug;
    const endpoint = isNews ? '/api/news' : '/api/announcements';
    const isEditing = Boolean(editingSlug);
    const url = isEditing ? `${endpoint}/${editingSlug}` : endpoint;
    const key = `${type}-${isEditing ? `update-${editingSlug}` : 'create'}`;

    setMessage('');
    setError('');
    setLoadingState(key, true);

    try {
      const payload = {
        title: formState.title.trim(),
        summary: formState.summary.trim(),
        content: formState.content.trim(),
        date: toIsoString(formState.date),
        displayFrom: toIsoString(formState.displayFrom),
        displayUntil: toIsoString(formState.displayUntil),
        imageUrl: formState.imageUrl || null
      };

      const response = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'ไม่สามารถบันทึกข้อมูลได้');
      }

      setItems((prev) =>
        isEditing ? prev.map((item) => (item.slug === editingSlug ? data : item)) : [data, ...prev]
      );
      setEdits((prev) => ({
        ...prev,
        [data.slug]: {
          displayFrom: toInputValue(data.displayFrom),
          displayUntil: toInputValue(data.displayUntil)
        }
      }));
      setFormState(emptyForm);
      if (isNews) {
        setNewsEditingSlug(null);
      } else {
        setAnnouncementEditingSlug(null);
      }
      setMessage(isEditing ? 'อัปเดตข้อมูลเรียบร้อยแล้ว' : 'บันทึกข้อมูลเรียบร้อยแล้ว');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingState(key, false);
    }
  };

  const handleTogglePublished = async (slug, published, type) => {
    const endpoint = type === 'news' ? `/api/news/${slug}` : `/api/announcements/${slug}`;
    const key = `${type}-toggle-${slug}`;
    if (type === 'news') {
      setNewsMessage('');
    } else {
      setAnnouncementMessage('');
    }
    setLoadingState(key, true);

    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'ไม่สามารถอัปเดตสถานะได้');
      }

      if (type === 'news') {
        setNewsItems((prev) => prev.map((item) => (item.slug === slug ? data : item)));
        setNewsError('');
        setNewsMessage('ปรับสถานะเรียบร้อยแล้ว');
      } else {
        setAnnouncementItems((prev) => prev.map((item) => (item.slug === slug ? data : item)));
        setAnnouncementError('');
        setAnnouncementMessage('ปรับสถานะเรียบร้อยแล้ว');
      }
    } catch (error) {
      if (type === 'news') {
        setNewsError(error.message);
      } else {
        setAnnouncementError(error.message);
      }
    } finally {
      setLoadingState(key, false);
    }
  };

  const handleScheduleSave = async (slug, type) => {
    const edits = type === 'news' ? newsEdits : announcementEdits;
    const endpoint = type === 'news' ? `/api/news/${slug}` : `/api/announcements/${slug}`;
    const key = `${type}-schedule-${slug}`;
    if (type === 'news') {
      setNewsMessage('');
    } else {
      setAnnouncementMessage('');
    }

    const displayFrom = toIsoString(edits[slug]?.displayFrom);
    const displayUntil = toIsoString(edits[slug]?.displayUntil);

    setLoadingState(key, true);

    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayFrom, displayUntil })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'ไม่สามารถอัปเดตตารางเผยแพร่ได้');
      }

      if (type === 'news') {
        setNewsItems((prev) => prev.map((item) => (item.slug === slug ? data : item)));
        setNewsEdits((prev) => ({
          ...prev,
          [slug]: {
            displayFrom: toInputValue(data.displayFrom),
            displayUntil: toInputValue(data.displayUntil)
          }
        }));
        setNewsError('');
        setNewsMessage('อัปเดตช่วงเวลาเรียบร้อยแล้ว');
      } else {
        setAnnouncementItems((prev) => prev.map((item) => (item.slug === slug ? data : item)));
        setAnnouncementEdits((prev) => ({
          ...prev,
          [slug]: {
            displayFrom: toInputValue(data.displayFrom),
            displayUntil: toInputValue(data.displayUntil)
          }
        }));
        setAnnouncementError('');
        setAnnouncementMessage('อัปเดตช่วงเวลาเรียบร้อยแล้ว');
      }
    } catch (error) {
      if (type === 'news') {
        setNewsError(error.message);
      } else {
        setAnnouncementError(error.message);
      }
    } finally {
      setLoadingState(key, false);
    }
  };

  const handleDelete = async (slug, type) => {
    const endpoint = type === 'news' ? `/api/news/${slug}` : `/api/announcements/${slug}`;
    const key = `${type}-delete-${slug}`;
    if (type === 'news') {
      setNewsMessage('');
    } else {
      setAnnouncementMessage('');
    }
    setLoadingState(key, true);

    try {
      const response = await fetch(endpoint, { method: 'DELETE' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'ไม่สามารถลบข้อมูลได้');
      }

      if (type === 'news') {
        setNewsItems((prev) => prev.filter((item) => item.slug !== slug));
        setNewsEdits((prev) => {
          const { [slug]: removed, ...rest } = prev;
          return rest;
        });
        setNewsError('');
        setNewsMessage('ลบรายการเรียบร้อยแล้ว');
        if (newsEditingSlug === slug) {
          setNewsEditingSlug(null);
          setNewsForm(emptyForm);
        }
      } else {
        setAnnouncementItems((prev) => prev.filter((item) => item.slug !== slug));
        setAnnouncementEdits((prev) => {
          const { [slug]: removed, ...rest } = prev;
          return rest;
        });
        setAnnouncementError('');
        setAnnouncementMessage('ลบรายการเรียบร้อยแล้ว');
        if (announcementEditingSlug === slug) {
          setAnnouncementEditingSlug(null);
          setAnnouncementForm(emptyForm);
        }
      }
    } catch (error) {
      if (type === 'news') {
        setNewsError(error.message);
      } else {
        setAnnouncementError(error.message);
      }
    } finally {
      setLoadingState(key, false);
    }
  };

  const handleImageChange = async (slug, file, type) => {
    const key = `${type}-image-${slug}`;
    if (type === 'news') {
      setNewsMessage('');
    } else {
      setAnnouncementMessage('');
    }

    try {
      const url = await uploadImage(file, (innerKey, value) => {
        setLoadingState(innerKey === 'upload' ? key : innerKey, value);
      });

      const endpoint = type === 'news' ? `/api/news/${slug}` : `/api/announcements/${slug}`;

      setLoadingState(key, true);
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: url })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'ไม่สามารถบันทึกรูปภาพได้');
      }

      if (type === 'news') {
        setNewsItems((prev) => prev.map((item) => (item.slug === slug ? data : item)));
        setNewsError('');
        setNewsMessage('อัปเดตรูปภาพเรียบร้อยแล้ว');
        if (newsEditingSlug === slug) {
          setNewsForm((prev) => ({ ...prev, imageUrl: data.imageUrl || '' }));
        }
      } else {
        setAnnouncementItems((prev) => prev.map((item) => (item.slug === slug ? data : item)));
        setAnnouncementError('');
        setAnnouncementMessage('อัปเดตรูปภาพเรียบร้อยแล้ว');
        if (announcementEditingSlug === slug) {
          setAnnouncementForm((prev) => ({ ...prev, imageUrl: data.imageUrl || '' }));
        }
      }
    } catch (error) {
      if (type === 'news') {
        setNewsError(error.message);
      } else {
        setAnnouncementError(error.message);
      }
    } finally {
      setLoadingState(key, false);
    }
  };

  const handleFormImageUpload = async (event, type) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const key = `${type}-form-image`;
    setLoadingState(key, true);

    try {
      const url = await uploadImage(file, () => {});
      if (type === 'news') {
        setNewsForm((prev) => ({ ...prev, imageUrl: url }));
      } else {
        setAnnouncementForm((prev) => ({ ...prev, imageUrl: url }));
      }
    } catch (error) {
      if (type === 'news') {
        setNewsError(error.message);
      } else {
        setAnnouncementError(error.message);
      }
    } finally {
      setLoadingState(key, false);
    }
  };

  const handleEditStart = (item, type) => {
    const formData = {
      title: item.title || '',
      summary: item.summary || '',
      content: item.content || '',
      date: toInputValue(item.date),
      displayFrom: toInputValue(item.displayFrom),
      displayUntil: toInputValue(item.displayUntil),
      imageUrl: item.imageUrl || ''
    };

    if (type === 'news') {
      setActiveTab('news');
      setNewsForm(formData);
      setNewsEditingSlug(item.slug);
      setNewsMessage('');
      setNewsError('');
    } else {
      setActiveTab('announcements');
      setAnnouncementForm(formData);
      setAnnouncementEditingSlug(item.slug);
      setAnnouncementMessage('');
      setAnnouncementError('');
    }
  };

  const handleEditCancel = (type) => {
    if (type === 'news') {
      setNewsForm(emptyForm);
      setNewsEditingSlug(null);
      setNewsMessage('');
      setNewsError('');
    } else {
      setAnnouncementForm(emptyForm);
      setAnnouncementEditingSlug(null);
      setAnnouncementMessage('');
      setAnnouncementError('');
    }
  };

  const renderItems = (items, edits, type, setEdits) => (
    <div className="mt-10 space-y-6">
      {items.map((item) => (
        <div key={item.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-neutral">{item.title}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.published ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {item.published ? 'เผยแพร่' : 'ซ่อนอยู่'}
                </span>
              </div>
              <p className="text-sm text-slate-600">{item.summary}</p>
              <p className="text-xs text-slate-400">เผยแพร่เมื่อ: {formatThaiDateTime(item.date)}</p>
              {item.imageUrl && (
                <div className="overflow-hidden rounded-2xl border border-slate-100">
                  <img src={item.imageUrl} alt={item.title} className="h-56 w-full object-cover" loading="lazy" />
                </div>
              )}
            </div>
            <div className="flex w-full max-w-xs flex-col gap-4">
              <button
                type="button"
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
                onClick={() => handleEditStart(item, type)}
              >
                แก้ไขข้อมูล
              </button>
              <button
                type="button"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400"
                onClick={() => handleTogglePublished(item.slug, !item.published, type)}
                disabled={isLoading(`${type}-toggle-${item.slug}`)}
              >
                {item.published ? 'ซ่อนรายการ' : 'เผยแพร่ทันที'}
              </button>
              <label className="flex flex-col gap-2 text-xs font-semibold text-slate-600">
                เปลี่ยนรูปภาพ
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      handleImageChange(item.slug, file, type);
                    }
                  }}
                  className="rounded-full border border-dashed border-slate-300 px-4 py-2 text-xs"
                  disabled={isLoading(`${type}-image-${item.slug}`)}
                />
              </label>
              <div className="space-y-2 rounded-2xl border border-slate-200 p-3 text-xs text-slate-600">
                <p className="font-semibold text-neutral">กำหนดช่วงการแสดงผล</p>
                <label className="flex flex-col gap-1">
                  เริ่มเผยแพร่
                  <input
                    type="datetime-local"
                    value={edits[item.slug]?.displayFrom || ''}
                    onChange={(event) =>
                      setEdits((prev) => ({
                        ...prev,
                        [item.slug]: {
                          ...(prev[item.slug] ?? {}),
                          displayFrom: event.target.value
                        }
                      }))
                    }
                    className="rounded-xl border border-slate-300 px-3 py-2"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  สิ้นสุดการเผยแพร่
                  <input
                    type="datetime-local"
                    value={edits[item.slug]?.displayUntil || ''}
                    onChange={(event) =>
                      setEdits((prev) => ({
                        ...prev,
                        [item.slug]: {
                          ...(prev[item.slug] ?? {}),
                          displayUntil: event.target.value
                        }
                      }))
                    }
                    className="rounded-xl border border-slate-300 px-3 py-2"
                  />
                </label>
                <button
                  type="button"
                  className="w-full rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
                  onClick={() => handleScheduleSave(item.slug, type)}
                  disabled={isLoading(`${type}-schedule-${item.slug}`)}
                >
                  บันทึกช่วงเวลา
                </button>
              </div>
              <button
                type="button"
                className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:text-red-300"
                onClick={() => handleDelete(item.slug, type)}
                disabled={isLoading(`${type}-delete-${item.slug}`)}
              >
                ลบรายการ
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const newsEditsMemo = useMemo(() => newsEdits, [newsEdits]);
  const announcementEditsMemo = useMemo(() => announcementEdits, [announcementEdits]);
  const activeEditingSlug = activeTab === 'news' ? newsEditingSlug : announcementEditingSlug;
  const activeTypeLabel = activeTab === 'news' ? 'ข่าวประชาสัมพันธ์' : 'ประกาศ';
  const activeItemsList = activeTab === 'news' ? newsItems : announcementItems;
  const activeEditingItem = activeItemsList.find((item) => item.slug === activeEditingSlug);
  const activeSubmitKey = activeEditingSlug
    ? `${activeTab === 'news' ? 'news' : 'announcements'}-update-${activeEditingSlug}`
    : `${activeTab === 'news' ? 'news' : 'announcements'}-create`;

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-3xl border border-slate-200 bg-white px-10 py-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-neutral">กำลังตรวจสอบสิทธิ์การใช้งาน...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-xl backdrop-blur"
        >
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-neutral">Admin Console</h1>
            <p className="text-sm text-slate-500">เข้าสู่ระบบเพื่อจัดการข่าวและประกาศ</p>
          </div>
          <div className="space-y-4">
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
              ชื่อผู้ใช้
              <input
                type="text"
                value={loginForm.username}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, username: event.target.value }))}
                className="rounded-full border border-slate-300 px-4 py-3"
                placeholder="admin"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
              รหัสผ่าน
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                className="rounded-full border border-slate-300 px-4 py-3"
                placeholder="••••••"
              />
            </label>
          </div>
          {loginError && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{loginError}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isLoading('login')}
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f9]">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-semibold text-neutral">ศูนย์จัดการเนื้อหา</h1>
            <p className="text-sm text-slate-500">เพิ่มข่าวใหม่ ปรับสถานะการเผยแพร่ และอัปโหลดรูปภาพได้จากหน้านี้</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            disabled={isLoading('logout')}
          >
            ออกจากระบบ
          </button>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-3 px-6 pb-4">
          <button
            type="button"
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeTab === 'news'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
            onClick={() => setActiveTab('news')}
          >
            ข่าวประชาสัมพันธ์
          </button>
          <button
            type="button"
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeTab === 'announcements'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
            onClick={() => setActiveTab('announcements')}
          >
            ประกาศราชการ
          </button>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex-1 space-y-2">
              <h2 className="text-lg font-semibold text-neutral">
                {activeEditingSlug ? `แก้ไข${activeTypeLabel}` : `เพิ่ม${activeTypeLabel}`}
              </h2>
              <p className="text-sm text-slate-500">
                กรอกข้อมูลให้ครบถ้วน สามารถอัปโหลดรูปภาพและกำหนดช่วงการเผยแพร่ได้ตามต้องการ
              </p>
              {activeEditingItem && (
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {`กำลังแก้ไข${activeTypeLabel} “${activeEditingItem.title}”`}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {activeEditingItem && (
                <button
                  type="button"
                  onClick={() => handleEditCancel(activeTab === 'news' ? 'news' : 'announcements')}
                  className="rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
                >
                  ยกเลิกการแก้ไข
                </button>
              )}
              <button
                type="button"
                onClick={resetForms}
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                ล้างฟอร์ม
              </button>
            </div>
          </div>

          <form
            className="mt-8 grid gap-6 md:grid-cols-2"
            onSubmit={(event) => handleSubmit(event, activeTab === 'news' ? 'news' : 'announcements')}
          >
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
              หัวข้อ
              <input
                type="text"
                value={(activeTab === 'news' ? newsForm : announcementForm).title}
                onChange={(event) =>
                  activeTab === 'news'
                    ? setNewsForm((prev) => ({ ...prev, title: event.target.value }))
                    : setAnnouncementForm((prev) => ({ ...prev, title: event.target.value }))
                }
                className="rounded-xl border border-slate-300 px-4 py-3"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
              สรุปเนื้อหา
              <input
                type="text"
                value={(activeTab === 'news' ? newsForm : announcementForm).summary}
                onChange={(event) =>
                  activeTab === 'news'
                    ? setNewsForm((prev) => ({ ...prev, summary: event.target.value }))
                    : setAnnouncementForm((prev) => ({ ...prev, summary: event.target.value }))
                }
                className="rounded-xl border border-slate-300 px-4 py-3"
                required
              />
            </label>
            <label className="md:col-span-2 flex flex-col gap-2 text-sm font-semibold text-slate-600">
              เนื้อหาหลัก
              <textarea
                value={(activeTab === 'news' ? newsForm : announcementForm).content}
                onChange={(event) =>
                  activeTab === 'news'
                    ? setNewsForm((prev) => ({ ...prev, content: event.target.value }))
                    : setAnnouncementForm((prev) => ({ ...prev, content: event.target.value }))
                }
                className="min-h-[160px] rounded-xl border border-slate-300 px-4 py-3"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
              วันที่เผยแพร่ (แสดงบนหน้าข่าว)
              <input
                type="datetime-local"
                value={(activeTab === 'news' ? newsForm : announcementForm).date}
                onChange={(event) =>
                  activeTab === 'news'
                    ? setNewsForm((prev) => ({ ...prev, date: event.target.value }))
                    : setAnnouncementForm((prev) => ({ ...prev, date: event.target.value }))
                }
                className="rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
              เริ่มเผยแพร่
              <input
                type="datetime-local"
                value={(activeTab === 'news' ? newsForm : announcementForm).displayFrom}
                onChange={(event) =>
                  activeTab === 'news'
                    ? setNewsForm((prev) => ({ ...prev, displayFrom: event.target.value }))
                    : setAnnouncementForm((prev) => ({ ...prev, displayFrom: event.target.value }))
                }
                className="rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
              สิ้นสุดการเผยแพร่
              <input
                type="datetime-local"
                value={(activeTab === 'news' ? newsForm : announcementForm).displayUntil}
                onChange={(event) =>
                  activeTab === 'news'
                    ? setNewsForm((prev) => ({ ...prev, displayUntil: event.target.value }))
                    : setAnnouncementForm((prev) => ({ ...prev, displayUntil: event.target.value }))
                }
                className="rounded-xl border border-slate-300 px-4 py-3"
              />
            </label>
            <div className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
              รูปภาพประกอบ
              <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-xs text-slate-500">
                <p>รองรับไฟล์ .jpg .png .gif .webp ขนาดไม่เกิน 5MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleFormImageUpload(event, activeTab === 'news' ? 'news' : 'announcements')}
                  className="mt-3 w-full rounded-full border border-slate-300 px-4 py-2"
                  disabled={isLoading(`${activeTab === 'news' ? 'news' : 'announcements'}-form-image`)}
                />
                {(activeTab === 'news' ? newsForm : announcementForm).imageUrl && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={(activeTab === 'news' ? newsForm : announcementForm).imageUrl}
                      alt="ตัวอย่างรูปภาพ"
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2 flex items-center justify-end gap-3">
              {activeTab === 'news' && newsMessage && (
                <span className="rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-600">
                  {newsMessage}
                </span>
              )}
              {activeTab === 'news' && newsError && (
                <span className="rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-600">{newsError}</span>
              )}
              {activeTab === 'announcements' && announcementMessage && (
                <span className="rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-600">
                  {announcementMessage}
                </span>
              )}
              {activeTab === 'announcements' && announcementError && (
                <span className="rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-600">
                  {announcementError}
                </span>
              )}
              <button
                type="submit"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400"
                disabled={isLoading(activeSubmitKey)}
              >
                {activeEditingSlug ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}
              </button>
            </div>
          </form>
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral">
              {activeTab === 'news' ? 'ข่าวทั้งหมด' : 'ประกาศทั้งหมด'}
            </h2>
            <span className="text-sm text-slate-500">
              ทั้งหมด {activeTab === 'news' ? newsItems.length : announcementItems.length} รายการ
            </span>
          </div>
          {activeTab === 'news'
            ? renderItems(newsItems, newsEditsMemo, 'news', setNewsEdits)
            : renderItems(announcementItems, announcementEditsMemo, 'announcements', setAnnouncementEdits)}
          {activeTab === 'news' && newsError && (
            <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{newsError}</p>
          )}
          {activeTab === 'announcements' && announcementError && (
            <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{announcementError}</p>
          )}
        </section>
      </main>
    </div>
  );
}
