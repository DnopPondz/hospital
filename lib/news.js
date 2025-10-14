import { getDatabase } from './mongodb';

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

function normalizeNewsFields(item) {
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

let newsSeeded = false;

async function maybeSeedNews(collection) {
  if (newsSeeded) {
    return;
  }

  newsSeeded = true;

  try {
    const count = await collection.estimatedDocumentCount();
    if (count > 0) {
      return;
    }

    const seedModule = await import('../data/news.json', { assert: { type: 'json' } });
    const seedData = Array.isArray(seedModule?.default) ? seedModule.default : [];

    if (seedData.length === 0) {
      return;
    }

    const normalizedSeed = seedData.map((item) => normalizeNewsFields(item));
    if (normalizedSeed.length > 0) {
      await collection.insertMany(normalizedSeed);
    }
  } catch (error) {
    console.warn('ไม่สามารถ seed ข่าวตัวอย่างลง MongoDB ได้', error);
  }
}

async function getNewsCollection() {
  const db = await getDatabase();
  const collection = db.collection('news');
  await maybeSeedNews(collection);
  return collection;
}

function mapNewsDocument(doc) {
  const { _id, ...rest } = doc;
  const normalized = normalizeNewsFields(rest);
  return {
    ...normalized,
    id: _id?.toString()
  };
}

function buildVisibilityFilter(includeHidden) {
  if (includeHidden) {
    return {};
  }

  const nowIso = new Date().toISOString();

  return {
    published: true,
    $and: [
      {
        $or: [{ displayFrom: null }, { displayFrom: { $lte: nowIso } }]
      },
      {
        $or: [{ displayUntil: null }, { displayUntil: { $gte: nowIso } }]
      }
    ]
  };
}

export async function getNews({ includeHidden = false } = {}) {
  try {
    const collection = await getNewsCollection();
    const query = buildVisibilityFilter(includeHidden);
    const documents = await collection.find(query).sort({ date: -1 }).toArray();
    return documents.map((doc) => mapNewsDocument(doc));
  } catch (error) {
    console.error('ไม่สามารถดึงข้อมูลข่าวจาก MongoDB ได้', error);
    return [];
  }
}

export async function getNewsBySlug(slug, { includeHidden = false } = {}) {
  try {
    const collection = await getNewsCollection();
    const document = await collection.findOne({ slug });

    if (!document) {
      return null;
    }

    const newsItem = mapNewsDocument(document);

    if (includeHidden) {
      return newsItem;
    }

    if (!newsItem.published) {
      return null;
    }

    const now = Date.now();
    const startsAt = newsItem.displayFrom ? new Date(newsItem.displayFrom).getTime() : null;
    const endsAt = newsItem.displayUntil ? new Date(newsItem.displayUntil).getTime() : null;

    if (startsAt && startsAt > now) {
      return null;
    }

    if (endsAt && endsAt < now) {
      return null;
    }

    return newsItem;
  } catch (error) {
    console.error('ไม่สามารถดึงข่าวตาม slug จาก MongoDB ได้', error);
    return null;
  }
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

  const collection = await getNewsCollection();
  const requestedSlug = createSlug(title);

  let slug = requestedSlug;
  let counter = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await collection.findOne({ slug })) {
    slug = `${requestedSlug}-${counter}`;
    counter += 1;
  }

  const sanitizedDisplayFrom = toIsoOrNull(displayFrom);
  const sanitizedDisplayUntil = toIsoOrNull(displayUntil);

  validateScheduleRange(sanitizedDisplayFrom, sanitizedDisplayUntil);

  const newItem = normalizeNewsFields({
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
  });

  const result = await collection.insertOne(newItem);
  return mapNewsDocument({ ...newItem, _id: result.insertedId });
}

export async function updateNews(slug, updates = {}) {
  const collection = await getNewsCollection();
  const existing = await collection.findOne({ slug });

  if (!existing) {
    throw new Error('ไม่พบข่าวที่ต้องการปรับปรุง');
  }

  const { _id, ...rest } = existing;
  const next = { ...rest };

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

  const normalized = normalizeNewsFields(next);
  validateScheduleRange(normalized.displayFrom, normalized.displayUntil);

  await collection.updateOne({ _id }, { $set: normalized });
  return mapNewsDocument({ ...normalized, _id });
}

export async function deleteNews(slug) {
  const collection = await getNewsCollection();
  const result = await collection.deleteOne({ slug });

  if (result.deletedCount === 0) {
    throw new Error('ไม่พบข่าวที่ต้องการลบ');
  }
}
