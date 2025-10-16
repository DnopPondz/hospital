'use client';

import Link from 'next/link';
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

function parseDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
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

const SECTION_META = {
  dashboard: {
    title: 'แดชบอร์ดภาพรวม',
    description: 'ดูสถานะการเผยแพร่ กำหนดการหมดอายุ และสถิติสรุปการเข้าชม'
  },
  news: {
    title: 'จัดการข่าวประชาสัมพันธ์',
    description: 'สร้าง ปรับปรุง และกำหนดการเผยแพร่สำหรับข่าวประชาสัมพันธ์'
  },
  announcements: {
    title: 'จัดการประกาศราชการ',
    description: 'ดูแลประกาศให้ครบถ้วน พร้อมตั้งเวลาการแสดงผล'
  },
  logs: {
    title: 'บันทึกการเข้าชม',
    description: 'ตรวจสอบรายการที่ผู้อ่านเข้าชม รวมถึงจำนวนและเวลาล่าสุด'
  }
};

function getTypeLabel(type) {
  return type === 'news' ? 'ข่าวประชาสัมพันธ์' : 'ประกาศราชการ';
}

export default function AdminDashboard() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

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

  const [logStats, setLogStats] = useState({
    totals: { total: 0, news: 0, announcements: 0 },
    leaderboard: [],
    recent: []
  });
  const [logsError, setLogsError] = useState('');
  const [logsLoading, setLogsLoading] = useState(false);

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
      setNewsEdits({});
      setAnnouncementEdits({});
      setActiveSection('dashboard');
      setLogStats({ totals: { total: 0, news: 0, announcements: 0 }, leaderboard: [], recent: [] });
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

  const refreshLogs = async () => {
    if (!authenticated) {
      return;
    }

    setLogsError('');
    setLogsLoading(true);

    try {
      const response = await fetch('/api/admin/logs?limit=100', { cache: 'no-store' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'ไม่สามารถดึงบันทึกการเข้าชมได้');
      }

      setLogStats({
        totals: data?.totals || { total: 0, news: 0, announcements: 0 },
        leaderboard: Array.isArray(data?.leaderboard) ? data.leaderboard : [],
        recent: Array.isArray(data?.recent) ? data.recent : []
      });
    } catch (error) {
      setLogsError(error.message);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      refreshLogs();
    }
  }, [authenticated]);

  useEffect(() => {
    if (authenticated && activeSection === 'logs') {
      refreshLogs();
    }
  }, [activeSection, authenticated]);

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
    setNewsMessage('');
    setNewsError('');
    setAnnouncementMessage('');
    setAnnouncementError('');
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
    const setEditingSlug = isNews ? setNewsEditingSlug : setAnnouncementEditingSlug;
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
      setEditingSlug(null);
      setMessage(isEditing ? 'อัปเดตข้อมูลเรียบร้อยแล้ว' : 'บันทึกข้อมูลเรียบร้อยแล้ว');
      refreshLogs();
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
      refreshLogs();
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
      refreshLogs();
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
      refreshLogs();
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
      refreshLogs();
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
      setActiveSection('news');
      setNewsForm(formData);
      setNewsEditingSlug(item.slug);
      setNewsMessage('');
      setNewsError('');
    } else {
      setActiveSection('announcements');
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

  const newsEditsMemo = useMemo(() => newsEdits, [newsEdits]);
  const announcementEditsMemo = useMemo(() => announcementEdits, [announcementEdits]);

  const combinedItems = useMemo(
    () => [
      ...newsItems.map((item) => ({ ...item, type: 'news' })),
      ...announcementItems.map((item) => ({ ...item, type: 'announcement' }))
    ],
    [newsItems, announcementItems]
  );

  const dashboardSummary = useMemo(() => {
    const now = Date.now();

    const publishedItems = combinedItems.filter((item) => item.published);
    const currentlyVisible = publishedItems.filter((item) => {
      const startsAt = parseDate(item.displayFrom);
      const endsAt = parseDate(item.displayUntil);
      return (!startsAt || startsAt.getTime() <= now) && (!endsAt || endsAt.getTime() >= now);
    });

    const scheduledItems = publishedItems
      .filter((item) => {
        const startsAt = parseDate(item.displayFrom);
        return startsAt && startsAt.getTime() > now;
      })
      .sort((a, b) => parseDate(a.displayFrom) - parseDate(b.displayFrom))
      .slice(0, 6);

    const expiringSoon = publishedItems
      .filter((item) => {
        const endsAt = parseDate(item.displayUntil);
        return endsAt && endsAt.getTime() >= now;
      })
      .sort((a, b) => parseDate(a.displayUntil) - parseDate(b.displayUntil))
      .slice(0, 6);

    const expiredItems = publishedItems
      .filter((item) => {
        const endsAt = parseDate(item.displayUntil);
        return endsAt && endsAt.getTime() < now;
      })
      .sort((a, b) => parseDate(b.displayUntil) - parseDate(a.displayUntil))
      .slice(0, 6);

    const latestUpdates = publishedItems
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);

    return {
      publishedCount: publishedItems.length,
      currentlyVisible,
      scheduledItems,
      expiringSoon,
      expiredItems,
      latestUpdates
    };
  }, [combinedItems]);

  const sectionTitle = SECTION_META[activeSection]?.title ?? 'แดชบอร์ด';
  const sectionDescription = SECTION_META[activeSection]?.description ?? '';

  const sidebarItems = [
    { key: 'dashboard', label: 'Dashboard', count: null },
    { key: 'news', label: 'Manage News', count: newsItems.length },
    { key: 'announcements', label: 'Manage Announcements', count: announcementItems.length },
    { key: 'logs', label: 'Read Logs', count: logStats.totals.total }
  ];
  const renderItems = (items, edits, type, setEdits) => (
    <div className="mt-10 space-y-6">
      {items.map((item) => (
        <div key={item.slug} className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-semibold text-neutral">{item.title}</h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                    item.published
                      ? 'bg-emerald-100 text-primary ring-1 ring-inset ring-emerald-200'
                      : 'bg-white text-emerald-600 ring-1 ring-inset ring-emerald-200'
                  }`}
                >
                  {item.published ? 'เผยแพร่' : 'ซ่อนอยู่'}
                </span>
              </div>
              <p className="text-sm text-emerald-800">{item.summary}</p>
              <p className="text-xs text-emerald-600">เผยแพร่เมื่อ: {formatThaiDateTime(item.date)}</p>
              {item.imageUrl && (
                <div className="overflow-hidden rounded-2xl border border-emerald-50">
                  <img src={item.imageUrl} alt={item.title} className="h-56 w-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="flex flex-wrap gap-3 text-xs text-emerald-700">
                <span className="rounded-full bg-emerald-50 px-3 py-1">
                  เริ่ม {item.displayFrom ? formatThaiDateTime(item.displayFrom) : 'ทันที'}
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1">
                  สิ้นสุด {item.displayUntil ? formatThaiDateTime(item.displayUntil) : 'ไม่มีกำหนด'}
                </span>
              </div>
            </div>
            <div className="flex w-full max-w-sm flex-col gap-4">
              <button
                type="button"
                className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:border-primary hover:text-primary"
                onClick={() => handleEditStart(item, type)}
              >
                แก้ไขข้อมูล
              </button>
              <button
                type="button"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-emerald-200 disabled:text-white/80"
                onClick={() => handleTogglePublished(item.slug, !item.published, type)}
                disabled={isLoading(`${type}-toggle-${item.slug}`)}
              >
                {item.published ? 'ซ่อนรายการ' : 'เผยแพร่ทันที'}
              </button>
              <label className="flex flex-col gap-2 text-xs font-semibold text-emerald-800">
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
                  className="rounded-full border border-dashed border-emerald-200 px-4 py-2 text-xs"
                  disabled={isLoading(`${type}-image-${item.slug}`)}
                />
              </label>
              <div className="space-y-2 rounded-2xl border border-emerald-100 p-3 text-xs text-emerald-800">
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
                    className="rounded-xl border border-emerald-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                    className="rounded-xl border border-emerald-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </label>
                <button
                  type="button"
                  className="w-full rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:border-emerald-200 disabled:text-emerald-600"
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
              <Link
                href={type === 'news' ? `/news/${item.slug}` : `/announcements/${item.slug}`}
                target="_blank"
                className="text-center text-xs font-semibold text-primary hover:underline"
              >
                เปิดดูหน้าเว็บไซต์
              </Link>
            </div>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="rounded-3xl border border-dashed border-emerald-200 bg-white p-12 text-center text-sm text-emerald-700">
          ยังไม่มีข้อมูลในหมวดนี้
        </div>
      )}
    </div>
  );

  const renderManageSection = (type) => {
    const isNews = type === 'news';
    const formState = isNews ? newsForm : announcementForm;
    const setFormState = isNews ? setNewsForm : setAnnouncementForm;
    const editingSlug = isNews ? newsEditingSlug : announcementEditingSlug;
    const message = isNews ? newsMessage : announcementMessage;
    const error = isNews ? newsError : announcementError;
    const items = isNews ? newsItems : announcementItems;
    const edits = isNews ? newsEditsMemo : announcementEditsMemo;
    const setEdits = isNews ? setNewsEdits : setAnnouncementEdits;
    const formImageKey = isNews ? 'news-form-image' : 'announcements-form-image';
    const typeLabel = getTypeLabel(type);
    const submitKey = editingSlug
      ? `${type}-update-${editingSlug}`
      : `${type}-create`;

    return (
      <div className="space-y-10">
        <section className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1 space-y-3">
              <h2 className="text-lg font-semibold text-neutral">
                {editingSlug ? `แก้ไข${typeLabel}` : `เพิ่ม${typeLabel}`}
              </h2>
              <p className="text-sm text-emerald-700">
                กรอกข้อมูลให้ครบถ้วน สามารถอัปโหลดรูปภาพและกำหนดช่วงการเผยแพร่ได้ตามต้องการ
              </p>
              {editingSlug && (
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary" />กำลังแก้ไข {items.find((item) => item.slug === editingSlug)?.title}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {editingSlug && (
                <button
                  type="button"
                  onClick={() => handleEditCancel(type)}
                  className="rounded-full border border-primary/40 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
                >
                  ยกเลิกการแก้ไข
                </button>
              )}
              <button
                type="button"
                onClick={resetForms}
                className="rounded-full border border-emerald-200 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50"
              >
                ล้างฟอร์ม
              </button>
            </div>
          </div>

          <form className="mt-8 grid gap-6 md:grid-cols-2" onSubmit={(event) => handleSubmit(event, type)}>
            <label className="flex flex-col gap-2 text-sm font-semibold text-emerald-800">
              หัวข้อ
              <input
                type="text"
                value={formState.title}
                onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
                className="rounded-xl border border-emerald-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-emerald-800">
              สรุปเนื้อหา
              <input
                type="text"
                value={formState.summary}
                onChange={(event) => setFormState((prev) => ({ ...prev, summary: event.target.value }))}
                className="rounded-xl border border-emerald-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </label>
            <label className="md:col-span-2 flex flex-col gap-2 text-sm font-semibold text-emerald-800">
              เนื้อหาหลัก
              <textarea
                value={formState.content}
                onChange={(event) => setFormState((prev) => ({ ...prev, content: event.target.value }))}
                className="min-h-[160px] rounded-xl border border-emerald-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-emerald-800">
              วันที่เผยแพร่ (แสดงบนหน้าข่าว)
              <input
                type="datetime-local"
                value={formState.date}
                onChange={(event) => setFormState((prev) => ({ ...prev, date: event.target.value }))}
                className="rounded-xl border border-emerald-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-emerald-800">
              เริ่มเผยแพร่
              <input
                type="datetime-local"
                value={formState.displayFrom}
                onChange={(event) => setFormState((prev) => ({ ...prev, displayFrom: event.target.value }))}
                className="rounded-xl border border-emerald-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-emerald-800">
              สิ้นสุดการเผยแพร่
              <input
                type="datetime-local"
                value={formState.displayUntil}
                onChange={(event) => setFormState((prev) => ({ ...prev, displayUntil: event.target.value }))}
                className="rounded-xl border border-emerald-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <div className="flex flex-col gap-2 text-sm font-semibold text-emerald-800">
              รูปภาพประกอบ
              <div className="rounded-2xl border border-dashed border-emerald-200 p-4 text-xs text-emerald-700">
                <p>รองรับไฟล์ .jpg .png .gif .webp ขนาดไม่เกิน 5MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleFormImageUpload(event, type)}
                  className="mt-3 w-full rounded-full border border-emerald-200 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading(formImageKey)}
                />
                {formState.imageUrl && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-emerald-100">
                    <img src={formState.imageUrl} alt="ตัวอย่างรูปภาพ" className="h-40 w-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center justify-end gap-3">
              {message && (
                <span className="rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-600">{message}</span>
              )}
              {error && (
                <span className="rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-600">{error}</span>
              )}
              <button
                type="submit"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-emerald-200 disabled:text-white/80"
                disabled={isLoading(submitKey)}
              >
                {editingSlug ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}
              </button>
            </div>
          </form>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral">{`${typeLabel}ทั้งหมด`}</h2>
            <span className="text-sm text-emerald-700">ทั้งหมด {items.length} รายการ</span>
          </div>
          {type === 'news'
            ? renderItems(items, edits, 'news', setEdits)
            : renderItems(items, edits, 'announcements', setEdits)}
          {error && (
            <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}
        </section>
      </div>
    );
  };
  const renderDashboard = () => (
    <div className="space-y-10">
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-emerald-700">จำนวนข่าวทั้งหมด</p>
          <p className="mt-3 text-3xl font-semibold text-neutral">{newsItems.length}</p>
          <p className="mt-2 text-xs text-emerald-600">เผยแพร่ {dashboardSummary.publishedCount} รายการ</p>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-emerald-700">จำนวนประกาศทั้งหมด</p>
          <p className="mt-3 text-3xl font-semibold text-neutral">{announcementItems.length}</p>
          <p className="mt-2 text-xs text-emerald-600">กำลังแสดง {dashboardSummary.currentlyVisible.length} รายการ</p>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-emerald-700">ผู้อ่านทั้งหมด</p>
          <p className="mt-3 text-3xl font-semibold text-neutral">{logStats.totals.total}</p>
          <p className="mt-2 text-xs text-emerald-600">ข่าว {logStats.totals.news} / ประกาศ {logStats.totals.announcements}</p>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-emerald-700">ตารางเวลาที่รอเผยแพร่</p>
          <p className="mt-3 text-3xl font-semibold text-neutral">{dashboardSummary.scheduledItems.length}</p>
          <p className="mt-2 text-xs text-emerald-600">
            รายการแรก {dashboardSummary.scheduledItems[0]?.displayFrom ? formatThaiDateTime(dashboardSummary.scheduledItems[0].displayFrom) : '—'}
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-neutral">รายการอัปเดตล่าสุด</h3>
            <span className="text-xs text-emerald-600">{dashboardSummary.latestUpdates.length} รายการ</span>
          </div>
          <ul className="space-y-3">
            {dashboardSummary.latestUpdates.map((item) => (
              <li key={`${item.type}-${item.slug}`} className="rounded-2xl border border-emerald-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-neutral">{item.title}</p>
                    <p className="text-xs text-emerald-700">{getTypeLabel(item.type)}</p>
                  </div>
                  <p className="text-xs text-emerald-600">เผยแพร่ {formatThaiDateTime(item.date)}</p>
                </div>
              </li>
            ))}
            {dashboardSummary.latestUpdates.length === 0 && (
              <li className="rounded-2xl border border-dashed border-emerald-100 p-6 text-center text-sm text-emerald-700">
                ยังไม่มีข้อมูลที่เผยแพร่
              </li>
            )}
          </ul>
        </div>
        <div className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-neutral">สถิติการอ่านล่าสุด</h3>
            <button
              type="button"
              onClick={refreshLogs}
              className="text-xs font-semibold text-primary hover:underline"
              disabled={logsLoading}
            >
              {logsLoading ? 'กำลังโหลด...' : 'รีเฟรช'}
            </button>
          </div>
          <ul className="space-y-3">
            {logStats.leaderboard.slice(0, 5).map((item) => (
              <li key={`${item.type}-${item.slug}`} className="rounded-2xl border border-emerald-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-neutral">{item.title || item.slug}</p>
                    <p className="text-xs text-emerald-700">{getTypeLabel(item.type)}</p>
                  </div>
                  <div className="text-right text-xs text-emerald-700">
                    <p className="font-semibold text-primary">{item.count.toLocaleString('th-TH')} ครั้ง</p>
                    <p className="text-emerald-600">ล่าสุด {formatThaiDateTime(item.lastReadAt)}</p>
                  </div>
                </div>
              </li>
            ))}
            {logStats.leaderboard.length === 0 && (
              <li className="rounded-2xl border border-dashed border-emerald-100 p-6 text-center text-sm text-emerald-700">
                ยังไม่มีข้อมูลการเข้าชม
              </li>
            )}
            {logsError && (
              <li className="rounded-2xl bg-red-50 p-4 text-xs text-red-600">{logsError}</li>
            )}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-neutral">ใกล้หมดกำหนดการเผยแพร่</h3>
            <span className="text-xs text-emerald-600">{dashboardSummary.expiringSoon.length} รายการ</span>
          </div>
          <ul className="space-y-3">
            {dashboardSummary.expiringSoon.map((item) => (
              <li key={`${item.type}-${item.slug}`} className="rounded-2xl border border-emerald-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-neutral">{item.title}</p>
                    <p className="text-xs text-emerald-700">{getTypeLabel(item.type)}</p>
                  </div>
                  <p className="text-xs text-rose-500">สิ้นสุด {formatThaiDateTime(item.displayUntil)}</p>
                </div>
              </li>
            ))}
            {dashboardSummary.expiringSoon.length === 0 && (
              <li className="rounded-2xl border border-dashed border-emerald-100 p-6 text-center text-sm text-emerald-700">
                ไม่มีรายการที่ใกล้หมดกำหนด
              </li>
            )}
          </ul>
        </div>
        <div className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-neutral">รายการที่หมดอายุแล้ว</h3>
            <span className="text-xs text-emerald-600">{dashboardSummary.expiredItems.length} รายการ</span>
          </div>
          <ul className="space-y-3">
            {dashboardSummary.expiredItems.map((item) => (
              <li key={`${item.type}-${item.slug}`} className="rounded-2xl border border-emerald-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-neutral">{item.title}</p>
                    <p className="text-xs text-emerald-700">{getTypeLabel(item.type)}</p>
                  </div>
                  <p className="text-xs text-emerald-600">สิ้นสุด {formatThaiDateTime(item.displayUntil)}</p>
                </div>
              </li>
            ))}
            {dashboardSummary.expiredItems.length === 0 && (
              <li className="rounded-2xl border border-dashed border-emerald-100 p-6 text-center text-sm text-emerald-700">
                ยังไม่มีรายการที่หมดอายุ
              </li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
  const renderLogs = () => (
    <div className="space-y-10">
      <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-neutral">สรุปการเข้าชม</h2>
            <p className="text-sm text-emerald-700">จำนวนการเข้าชมทั้งหมดจากผู้ใช้งานจริง</p>
          </div>
          <button
            type="button"
            onClick={refreshLogs}
            className="rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:border-emerald-200 disabled:text-emerald-600"
            disabled={logsLoading}
          >
            {logsLoading ? 'กำลังโหลด...' : 'รีเฟรชข้อมูล'}
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 p-4 text-center">
            <p className="text-xs text-emerald-700">จำนวนรวม</p>
            <p className="mt-2 text-2xl font-semibold text-neutral">{logStats.totals.total}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 p-4 text-center">
            <p className="text-xs text-emerald-700">ข่าว</p>
            <p className="mt-2 text-2xl font-semibold text-neutral">{logStats.totals.news}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 p-4 text-center">
            <p className="text-xs text-emerald-700">ประกาศ</p>
            <p className="mt-2 text-2xl font-semibold text-neutral">{logStats.totals.announcements}</p>
          </div>
        </div>
        {logsError && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-xs text-red-600">{logsError}</p>}
      </section>

      <section className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral">รายการที่ถูกอ่านมากที่สุด</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-emerald-100 text-left text-sm">
            <thead className="bg-emerald-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-emerald-800">ชื่อเรื่อง</th>
                <th className="px-4 py-3 font-semibold text-emerald-800">ประเภท</th>
                <th className="px-4 py-3 font-semibold text-emerald-800">จำนวนครั้ง</th>
                <th className="px-4 py-3 font-semibold text-emerald-800">อ่านล่าสุด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {logStats.leaderboard.map((item) => (
                <tr key={`${item.type}-${item.slug}`} className="hover:bg-emerald-50">
                  <td className="px-4 py-3 text-neutral">{item.title || item.slug}</td>
                  <td className="px-4 py-3 text-emerald-700">{getTypeLabel(item.type)}</td>
                  <td className="px-4 py-3 text-primary">{item.count.toLocaleString('th-TH')}</td>
                  <td className="px-4 py-3 text-emerald-600">{formatThaiDateTime(item.lastReadAt)}</td>
                </tr>
              ))}
              {logStats.leaderboard.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-sm text-emerald-700">
                    ยังไม่มีข้อมูลการเข้าชม
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral">ประวัติการเข้าชมล่าสุด</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-emerald-100 text-left text-sm">
            <thead className="bg-emerald-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-emerald-800">ชื่อเรื่อง</th>
                <th className="px-4 py-3 font-semibold text-emerald-800">ประเภท</th>
                <th className="px-4 py-3 font-semibold text-emerald-800">เวลา</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {logStats.recent.map((item, index) => (
                <tr key={`${item.type}-${item.slug}-${index}`} className="hover:bg-emerald-50">
                  <td className="px-4 py-3 text-neutral">{item.title || item.slug}</td>
                  <td className="px-4 py-3 text-emerald-700">{getTypeLabel(item.type)}</td>
                  <td className="px-4 py-3 text-emerald-600">{formatThaiDateTime(item.readAt)}</td>
                </tr>
              ))}
              {logStats.recent.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-4 py-6 text-center text-sm text-emerald-700">
                    ยังไม่มีการเข้าชมล่าสุด
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-emerald-50 to-emerald-100">
        <div className="rounded-3xl border border-emerald-100 bg-white px-10 py-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-neutral">กำลังตรวจสอบสิทธิ์การใช้งาน...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-emerald-50 to-emerald-100">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md space-y-6 rounded-3xl border border-emerald-100 bg-white/90 p-10 shadow-xl backdrop-blur"
        >
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-neutral">Admin Console</h1>
            <p className="text-sm text-emerald-700">เข้าสู่ระบบเพื่อจัดการข่าวและประกาศ</p>
          </div>
          <div className="space-y-4">
            <label className="flex flex-col gap-2 text-sm font-semibold text-emerald-800">
              ชื่อผู้ใช้
              <input
                type="text"
                value={loginForm.username}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, username: event.target.value }))}
                className="rounded-full border border-emerald-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="admin"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-emerald-800">
              รหัสผ่าน
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                className="rounded-full border border-emerald-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="••••••"
              />
            </label>
          </div>
          {loginError && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{loginError}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-emerald-200 disabled:text-white/80"
            disabled={isLoading('login')}
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-emerald-50 to-emerald-100">
      <aside className="hidden w-72 flex-col border-r border-emerald-100 bg-gradient-to-b from-white via-emerald-50/80 to-white px-6 py-8 lg:flex">
        <div className="mb-8 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">ThaiGov Portal</p>
          <h2 className="text-xl font-semibold text-neutral">ศูนย์จัดการเนื้อหา</h2>
        </div>
        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveSection(item.key)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                activeSection === item.key ? 'bg-primary text-white shadow-sm' : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <span>{item.label}</span>
              {item.count !== null && (
                <span className={`rounded-full px-2 py-0.5 text-xs ${activeSection === item.key ? 'bg-white/20' : 'bg-emerald-100 text-emerald-800'}`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto rounded-full border border-emerald-200 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50"
          disabled={isLoading('logout')}
        >
          ออกจากระบบ
        </button>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="border-b border-emerald-100 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-neutral">{sectionTitle}</h1>
              <p className="text-sm text-emerald-700">{sectionDescription}</p>
            </div>
            <div className="flex items-center gap-3 lg:hidden">
              <select
                value={activeSection}
                onChange={(event) => setActiveSection(event.target.value)}
                className="rounded-full border border-emerald-200 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-emerald-800"
              >
                {sidebarItems.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-emerald-200 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50"
                disabled={isLoading('logout')}
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-white via-emerald-50 to-emerald-100">
          <div className="mx-auto max-w-6xl px-6 py-10">
            {activeSection === 'dashboard' && renderDashboard()}
            {activeSection === 'news' && renderManageSection('news')}
            {activeSection === 'announcements' && renderManageSection('announcements')}
            {activeSection === 'logs' && renderLogs()}
          </div>
        </main>
      </div>
    </div>
  );
}
