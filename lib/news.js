import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'news.json');

async function readNewsFile() {
  try {
    const content = await fs.readFile(DATA_FILE_PATH, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

async function writeNewsFile(items) {
  await fs.writeFile(DATA_FILE_PATH, `${JSON.stringify(items, null, 2)}\n`, 'utf8');
}

function sortNews(items) {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.date ?? 0).getTime();
    const bTime = new Date(b.date ?? 0).getTime();

    if (aTime !== bTime) {
      return bTime - aTime;
    }

    return (a.slug || '').localeCompare(b.slug || '');
  });
}

function toIsoOrNull(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function sanitizeImageUrl(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
}

function normalizeNews(item) {
  if (!item) {
    return null;
  }

  const isoDate = toIsoOrNull(item.date) ?? new Date().toISOString();

  return {
    ...item,
    date: isoDate,
    published: item?.published !== false,
    displayFrom: toIsoOrNull(item.displayFrom),
    displayUntil: toIsoOrNull(item.displayUntil),
    imageUrl: sanitizeImageUrl(item.imageUrl)
  };
}

function validateScheduleRange(displayFrom, displayUntil) {
  if (!displayFrom || !displayUntil) {
    return;
  }

  const start = new Date(displayFrom);
  const end = new Date(displayUntil);

  if (start.getTime() > end.getTime()) {
    throw new Error('วันสิ้นสุดการเผยแพร่ต้องไม่น้อยกว่าวันเริ่มต้น');
  }
}

function createSlug(title) {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\u0E00-\u0E7F-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return baseSlug || `news-${Date.now()}`;
}

function shouldDisplay(item, includeHidden = false) {
  if (includeHidden) {
    return true;
  }

  if (!item.published) {
    return false;
  }

  const now = Date.now();
  const startsAt = item.displayFrom ? new Date(item.displayFrom).getTime() : null;
  const endsAt = item.displayUntil ? new Date(item.displayUntil).getTime() : null;

  if (startsAt && startsAt > now) {
    return false;
  }

  if (endsAt && endsAt < now) {
    return false;
  }

  return true;
}

async function fetchAllNewsDocuments() {
  const documents = await readNewsFile();
  return sortNews(documents).map((item) => normalizeNews(item)).filter(Boolean);
}

export async function getNews({ includeHidden = false } = {}) {
  const news = await fetchAllNewsDocuments();
  return news.filter((item) => shouldDisplay(item, includeHidden));
}

export async function getNewsBySlug(slug, { includeHidden = false } = {}) {
  const documents = await readNewsFile();
  const document = documents.find((item) => item.slug === slug);

  if (!document) {
    return null;
  }

  const normalized = normalizeNews(document);
  return shouldDisplay(normalized, includeHidden) ? normalized : null;
}

export async function addNews({ title, summary, content, date, displayFrom, displayUntil, imageUrl }) {
  if (!title || !summary || !content) {
    throw new Error('กรุณาระบุข้อมูลข่าวให้ครบถ้วน');
  }

  const documents = await readNewsFile();
  const requestedSlug = createSlug(title);

  let slug = requestedSlug;
  let counter = 1;
  while (documents.some((item) => item.slug === slug)) {
    slug = `${requestedSlug}-${counter}`;
    counter += 1;
  }

  const sanitizedDisplayFrom = toIsoOrNull(displayFrom);
  const sanitizedDisplayUntil = toIsoOrNull(displayUntil);

  validateScheduleRange(sanitizedDisplayFrom, sanitizedDisplayUntil);

  const newItem = {
    title: title.trim(),
    slug,
    date: toIsoOrNull(date) ?? new Date().toISOString(),
    summary: summary.trim(),
    content: content.trim(),
    published: true,
    displayFrom: sanitizedDisplayFrom,
    displayUntil: sanitizedDisplayUntil,
    imageUrl: sanitizeImageUrl(imageUrl)
  };

  const normalizedNew = normalizeNews(newItem);
  const updated = sortNews([normalizedNew, ...documents]);
  await writeNewsFile(updated);

  return normalizedNew;
}

export async function updateNews(slug, updates = {}) {
  const documents = await readNewsFile();
  const index = documents.findIndex((item) => item.slug === slug);

  if (index === -1) {
    throw new Error('ไม่พบข่าวที่ต้องการปรับปรุง');
  }

  const payload = { ...documents[index] };

  if (Object.prototype.hasOwnProperty.call(updates, 'published')) {
    payload.published = Boolean(updates.published);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'displayFrom')) {
    payload.displayFrom = toIsoOrNull(updates.displayFrom);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'displayUntil')) {
    payload.displayUntil = toIsoOrNull(updates.displayUntil);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'imageUrl')) {
    payload.imageUrl = sanitizeImageUrl(updates.imageUrl);
  }

  const normalizedPayload = normalizeNews(payload);
  validateScheduleRange(normalizedPayload.displayFrom, normalizedPayload.displayUntil);

  const updateDoc = {};
  if (Object.prototype.hasOwnProperty.call(updates, 'published')) {
    updateDoc.published = normalizedPayload.published;
  }
  if (Object.prototype.hasOwnProperty.call(updates, 'displayFrom')) {
    updateDoc.displayFrom = normalizedPayload.displayFrom;
  }
  if (Object.prototype.hasOwnProperty.call(updates, 'displayUntil')) {
    updateDoc.displayUntil = normalizedPayload.displayUntil;
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'imageUrl')) {
    updateDoc.imageUrl = normalizedPayload.imageUrl;
  }

  if (Object.keys(updateDoc).length === 0) {
    throw new Error('ไม่พบข้อมูลที่ต้องการอัปเดต');
  }

  const normalized = normalizeNews({ ...documents[index], ...updateDoc });
  documents[index] = normalized;
  const sorted = sortNews(documents);
  await writeNewsFile(sorted);

  return normalized;
}

export async function deleteNews(slug) {
  const documents = await readNewsFile();
  const filtered = documents.filter((item) => item.slug !== slug);

  if (filtered.length === documents.length) {
    throw new Error('ไม่พบข่าวที่ต้องการลบ');
  }

  const sorted = sortNews(filtered);
  await writeNewsFile(sorted);
}
