import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'news.json');

async function readNewsFile() {
  const data = await fs.readFile(dataFilePath, 'utf8');
  const parsed = JSON.parse(data);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeNewsFile(news) {
  await fs.writeFile(dataFilePath, JSON.stringify(news, null, 2), 'utf8');
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

function toArrayOfStrings(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === 'string' ? entry : String(entry ?? '')))
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return String(value)
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function toOptionalString(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

const IMPORTANCE_LEVELS = new Set(['urgent', 'high', 'standard']);

function normalizeImportance(value) {
  if (!value) {
    return 'standard';
  }

  const normalized = String(value).toLowerCase().trim();
  if (IMPORTANCE_LEVELS.has(normalized)) {
    return normalized;
  }

  return 'standard';
}

function normalizeNews(item) {
  const isoDate = toIsoOrNull(item.date) ?? new Date().toISOString();

  return {
    ...item,
    title: typeof item.title === 'string' ? item.title.trim() : item.title,
    summary: typeof item.summary === 'string' ? item.summary.trim() : item.summary,
    content: typeof item.content === 'string' ? item.content.trim() : item.content,
    image: toOptionalString(item?.image),
    imageAlt: toOptionalString(item?.imageAlt),
    category: item?.category ? String(item.category).trim() : 'ทั่วไป',
    province: item?.province ? String(item.province).trim() : 'ส่วนกลาง',
    tags: toArrayOfStrings(item?.tags),
    audiences: toArrayOfStrings(item?.audiences),
    importance: normalizeImportance(item?.importance),
    date: isoDate,
    published: item?.published !== false,
    displayFrom: toIsoOrNull(item.displayFrom),
    displayUntil: toIsoOrNull(item.displayUntil)
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

export async function getNews({ includeHidden = false } = {}) {
  const news = await readNewsFile();
  return news
    .map((item) => normalizeNews(item))
    .filter((item) => {
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
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getNewsBySlug(slug, { includeHidden = false } = {}) {
  const news = await getNews({ includeHidden });
  return news.find((item) => item.slug === slug) ?? null;
}

export async function addNews({
  title,
  summary,
  content,
  date,
  displayFrom,
  displayUntil,
  category,
  province,
  importance,
  tags,
  audiences,
  image,
  imageAlt
}) {
  if (!title || !summary || !content) {
    throw new Error('กรุณาระบุข้อมูลข่าวให้ครบถ้วน');
  }

  const news = await getNews({ includeHidden: true });
  const requestedSlug = createSlug(title);

  let slug = requestedSlug;
  let counter = 1;
  while (news.some((item) => item.slug === slug)) {
    slug = `${requestedSlug}-${counter}`;
    counter += 1;
  }

  const sanitizedDisplayFrom = toIsoOrNull(displayFrom);
  const sanitizedDisplayUntil = toIsoOrNull(displayUntil);

  validateScheduleRange(sanitizedDisplayFrom, sanitizedDisplayUntil);

  const newItem = {
    title: title.trim(),
    slug,
    date: date ?? new Date().toISOString(),
    summary: summary.trim(),
    content: content.trim(),
    published: true,
    displayFrom: sanitizedDisplayFrom,
    displayUntil: sanitizedDisplayUntil,
    category,
    province,
    importance,
    tags,
    audiences,
    image,
    imageAlt
  };

  const normalizedNew = normalizeNews(newItem);
  const updatedNews = [normalizedNew, ...news].map((item) => normalizeNews(item));
  await writeNewsFile(updatedNews);

  return normalizedNew;
}

export async function updateNews(slug, updates = {}) {
  const news = await readNewsFile();

  let found = false;
  const updated = news.map((item) => {
    if (item.slug !== slug) {
      return normalizeNews(item);
    }

    found = true;

    const next = { ...item };

    if (Object.prototype.hasOwnProperty.call(updates, 'title') && typeof updates.title === 'string') {
      next.title = updates.title;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'summary') && typeof updates.summary === 'string') {
      next.summary = updates.summary;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'content') && typeof updates.content === 'string') {
      next.content = updates.content;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'published')) {
      next.published = Boolean(updates.published);
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'displayFrom')) {
      next.displayFrom = toIsoOrNull(updates.displayFrom);
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'displayUntil')) {
      next.displayUntil = toIsoOrNull(updates.displayUntil);
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'category')) {
      next.category = updates.category;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'province')) {
      next.province = updates.province;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'importance')) {
      next.importance = updates.importance;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'tags')) {
      next.tags = updates.tags;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'audiences')) {
      next.audiences = updates.audiences;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'image')) {
      next.image = updates.image;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'imageAlt')) {
      next.imageAlt = updates.imageAlt;
    }

    const normalized = normalizeNews(next);
    validateScheduleRange(normalized.displayFrom, normalized.displayUntil);
    return normalized;
  });

  if (!found) {
    throw new Error('ไม่พบข่าวที่ต้องการปรับปรุง');
  }

  await writeNewsFile(updated);
  return normalizeNews(updated.find((item) => item.slug === slug));
}

export async function deleteNews(slug) {
  const news = await readNewsFile();
  const filtered = news.filter((item) => item.slug !== slug);

  if (filtered.length === news.length) {
    throw new Error('ไม่พบข่าวที่ต้องการลบ');
  }

  const normalized = filtered.map((item) => normalizeNews(item));
  await writeNewsFile(normalized);
}
