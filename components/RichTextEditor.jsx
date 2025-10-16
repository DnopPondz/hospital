'use client';

import { useEffect, useRef, useState } from 'react';

const FONT_SIZES = [
  { label: 'เล็ก', value: '0.875rem' },
  { label: 'ปกติ', value: '1rem' },
  { label: 'ใหญ่', value: '1.25rem' },
  { label: 'หัวข้อ', value: '1.5rem' }
];

const COLORS = [
  { label: 'ดำ', value: '#111827' },
  { label: 'เทา', value: '#334155' },
  { label: 'แดง', value: '#dc2626' },
  { label: 'เขียว', value: '#16a34a' },
  { label: 'น้ำเงิน', value: '#2563eb' }
];

export default function RichTextEditor({ value, onChange, onUploadImage, placeholder }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [uploading, setUploading] = useState(false);

  const emitChange = () => {
    if (!editorRef.current) {
      return;
    }
    const html = editorRef.current.innerHTML;
    const textContent = editorRef.current.textContent?.replace(/\u00a0/g, '').trim();
    const hasMedia = editorRef.current.querySelector('img');
    setIsEmpty(!hasMedia && !textContent);
    onChange?.(html);
  };

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    const currentHtml = editorRef.current.innerHTML;
    if ((value ?? '') !== currentHtml) {
      editorRef.current.innerHTML = value || '';
    }

    const textContent = editorRef.current.textContent?.replace(/\u00a0/g, '').trim();
    const hasMedia = editorRef.current.querySelector('img');
    setIsEmpty(!hasMedia && !textContent);
  }, [value]);

  const exec = (command, argument = null) => {
    if (typeof document === 'undefined') {
      return;
    }

    document.execCommand('styleWithCSS', false, true);
    document.execCommand(command, false, argument);
    emitChange();
  };

  const applyFontSize = (size) => {
    if (!editorRef.current || typeof document === 'undefined') {
      return;
    }

    document.execCommand('styleWithCSS', false, true);
    document.execCommand('fontSize', false, '7');

    editorRef.current.querySelectorAll('font[size="7"]').forEach((font) => {
      const span = document.createElement('span');
      span.style.fontSize = size;
      span.innerHTML = font.innerHTML;
      font.replaceWith(span);
    });

    emitChange();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file || !onUploadImage) {
      return;
    }

    try {
      setUploading(true);
      const url = await onUploadImage(file);
      if (url) {
        exec('insertImage', url);
      }
    } catch (error) {
      console.error('Failed to upload inline image', error);
      window.alert?.('ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setUploading(false);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    emitChange();
  };

  return (
    <div className="rounded-3xl border border-slate-200">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50/80 px-4 py-3 text-xs font-semibold text-slate-500">
        <div className="flex items-center gap-2">
          <label className="text-[11px] uppercase tracking-wide">ขนาด</label>
          <select
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 focus:border-primary focus:outline-none"
            onChange={(event) => {
              const option = FONT_SIZES.find((item) => item.value === event.target.value);
              if (option) {
                applyFontSize(option.value);
              }
              event.target.selectedIndex = 0;
            }}
            defaultValue="default"
          >
            <option disabled value="default">
              เลือกขนาด
            </option>
            {FONT_SIZES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => exec('bold')}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 transition hover:border-primary hover:text-primary"
          >
            ตัวหนา
          </button>
          <button
            type="button"
            onClick={() => exec('removeFormat')}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 transition hover:border-primary hover:text-primary"
          >
            ปกติ
          </button>
          <button
            type="button"
            onClick={() => exec('italic')}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 transition hover:border-primary hover:text-primary"
          >
            เอียง
          </button>
          <button
            type="button"
            onClick={() => exec('underline')}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 transition hover:border-primary hover:text-primary"
          >
            ขีดเส้น
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[11px] uppercase tracking-wide">สีตัวอักษร</label>
          <div className="flex items-center gap-1">
            {COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => exec('foreColor', color.value)}
                className="h-7 w-7 rounded-full border border-slate-200"
                style={{ backgroundColor: color.value }}
                title={color.label}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exec('insertUnorderedList')}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 transition hover:border-primary hover:text-primary"
          >
            รายการจุด
          </button>
          <button
            type="button"
            onClick={() => exec('insertOrderedList')}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 transition hover:border-primary hover:text-primary"
          >
            รายการเลข
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exec('justifyLeft')}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 transition hover:border-primary hover:text-primary"
          >
            ชิดซ้าย
          </button>
          <button
            type="button"
            onClick={() => exec('justifyCenter')}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 transition hover:border-primary hover:text-primary"
          >
            กึ่งกลาง
          </button>
          <button
            type="button"
            onClick={() => exec('justifyRight')}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 transition hover:border-primary hover:text-primary"
          >
            ชิดขวา
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 transition hover:border-primary hover:text-primary disabled:opacity-60"
          >
            {uploading ? 'กำลังอัปโหลด…' : 'เพิ่มรูปในเนื้อหา'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageUpload}
            hidden
          />
        </div>
      </div>
      <div
        ref={editorRef}
        className={`min-h-[220px] rounded-b-3xl px-4 py-4 text-sm leading-7 text-slate-700 focus:outline-none ${
          isFocused ? 'ring-2 ring-primary/40' : ''
        }`}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        data-empty={isEmpty}
        onInput={emitChange}
        onBlur={() => {
          setIsFocused(false);
          emitChange();
        }}
        onFocus={() => setIsFocused(true)}
        onKeyUp={emitChange}
        onPaste={handlePaste}
      />
      <style jsx>{`
        [data-empty="true"]::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
