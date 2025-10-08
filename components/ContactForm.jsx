'use client';

import { useState } from 'react';

const initialState = {
  fullname: '',
  email: '',
  message: ''
};

export default function ContactForm() {
  const [formData, setFormData] = useState(initialState);
  const [status, setStatus] = useState({ type: null, message: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus({ type: null, message: null });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการส่งข้อความ');
      }

      setStatus({ type: 'success', message: 'ส่งข้อความเรียบร้อย ขอบคุณที่ติดต่อเรา' });
      setFormData(initialState);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
      <div>
        <label className="text-sm font-medium text-neutral" htmlFor="fullname">
          ชื่อ-นามสกุล
        </label>
        <input
          id="fullname"
          name="fullname"
          type="text"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-neutral focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="กรอกชื่อ-นามสกุล"
          value={formData.fullname}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium text-neutral" htmlFor="email">
          อีเมล
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-neutral focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium text-neutral" htmlFor="message">
          ข้อความ
        </label>
        <textarea
          id="message"
          name="message"
          rows="4"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-neutral focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="ระบุรายละเอียดที่ต้องการติดต่อ"
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>
      {status.message ? (
        <p
          className={`text-sm ${
            status.type === 'success' ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {status.message}
        </p>
      ) : null}
      <button
        type="submit"
        className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-neutral disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'กำลังส่ง...' : 'ส่งข้อความ'}
      </button>
    </form>
  );
}
