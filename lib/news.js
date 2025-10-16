import { getCollection } from '@/lib/mongodb';
import { deleteUploadedFile } from '@/lib/uploads';
import { sanitizeRichText } from '@/lib/sanitize';
import { coerceBooleanInput } from '@/lib/inputs';

function deriveStatus({ published, displayFrom, displayUntil }) {
  if (!published) {
    return 'draft';
  }

  const now = Date.now();
  const startsAt = displayFrom ? new Date(displayFrom).getTime() : null;
  const endsAt = displayUntil ? new Date(displayUntil).getTime() : null;

  if (startsAt && startsAt > now) {
    return 'scheduled';
  }

  if (endsAt && endsAt < now) {
    return 'expired';
  }

  return 'published';
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

function normalizeNews(item) {
  if (!item) {
    return null;
  }

  const isoDate = toIsoOrNull(item.date) ?? new Date().toISOString();

  const normalized = {
    ...item,
    date: isoDate,
    published: item?.published !== false,
    displayFrom: toIsoOrNull(item.displayFrom),
    displayUntil: toIsoOrNull(item.displayUntil),
    imageUrl: item.imageUrl ?? null,
    content: sanitizeRichText(item.content ?? '')
  };

  return {
    ...normalized,
    status: deriveStatus(normalized)
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
  const collection = await getCollection('news');
  const documents = await collection.find({}).sort({ date: -1, slug: 1 }).toArray();
  const statusUpdates = [];

  const usedSlugs = new Set(
    documents
      .map((doc) => doc.slug?.trim())
      .filter((slug) => typeof slug === 'string' && slug.length > 0)
  );

  const missingSlugDocuments = documents.filter((doc) => {
    const slug = doc.slug;
    return typeof slug !== 'string' || slug.trim().length === 0;
  });

  if (missingSlugDocuments.length > 0) {
    await Promise.all(
      missingSlugDocuments.map(async (doc) => {
        const baseFromTitle = typeof doc.title === 'string' ? createSlug(doc.title) : '';
        const fallbackBase = baseFromTitle || `news-${doc._id.toString()}`;

        let candidate = fallbackBase;
        let counter = 1;

        while (usedSlugs.has(candidate)) {
          candidate = `${fallbackBase}-${counter}`;
          counter += 1;
        }

        usedSlugs.add(candidate);
        doc.slug = candidate;
        await collection.updateOne({ _id: doc._id }, { $set: { slug: candidate } });
      })
    );
  }

  const normalizedDocuments = documents
    .map(({ _id, ...item }) => {
      const normalized = normalizeNews(item);

      if (item.status !== normalized.status) {
        statusUpdates.push({ id: _id, status: normalized.status });
      }

      return normalized;
    })
    .filter(Boolean);

  if (statusUpdates.length > 0) {
    await Promise.all(
      statusUpdates.map(({ id, status }) => collection.updateOne({ _id: id }, { $set: { status } }))
    );
  }

  return normalizedDocuments;
}

export async function getNews({ includeHidden = false } = {}) {
  const news = await fetchAllNewsDocuments();
  return news.filter((item) => shouldDisplay(item, includeHidden));
}

export async function getNewsBySlug(slug, { includeHidden = false } = {}) {
  const collection = await getCollection('news');
  const document = await collection.findOne({ slug });

  if (!document) {
    return null;
  }

  const { _id, ...rest } = document;
  const normalized = normalizeNews(rest);

  if (rest.status !== normalized.status) {
    await collection.updateOne({ _id }, { $set: { status: normalized.status } });
  }

  return shouldDisplay(normalized, includeHidden) ? normalized : null;
}

export async function addNews({ title, summary, content, date, displayFrom, displayUntil, imageUrl }) {
  if (!title || !summary || !content) {
    throw new Error('กรุณาระบุข้อมูลข่าวให้ครบถ้วน');
  }

  const collection = await getCollection('news');
  const requestedSlug = createSlug(title);

  let slug = requestedSlug;
  let counter = 1;
  while (await collection.findOne({ slug })) {
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
    content: sanitizeRichText(content),
    published: true,
    displayFrom: sanitizedDisplayFrom,
    displayUntil: sanitizedDisplayUntil,
    imageUrl: imageUrl ?? null
  };

  const normalizedNew = normalizeNews(newItem);
  await collection.insertOne(normalizedNew);

  return normalizedNew;
}

export async function updateNews(slug, updates = {}) {
  const collection = await getCollection('news');
  const existing = await collection.findOne({ slug });

  if (!existing) {
    throw new Error('ไม่พบข่าวที่ต้องการปรับปรุง');
  }

  const payload = { ...existing };

  if (Object.prototype.hasOwnProperty.call(updates, 'title')) {
    const nextTitle = (updates.title ?? '').toString().trim();
    if (!nextTitle) {
      throw new Error('กรุณาระบุหัวข้อข่าว');
    }
    payload.title = nextTitle;
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'summary')) {
    const nextSummary = (updates.summary ?? '').toString().trim();
    if (!nextSummary) {
      throw new Error('กรุณาระบุสรุปข่าว');
    }
    payload.summary = nextSummary;
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'content')) {
    const sanitizedContent = sanitizeRichText(updates.content);
    if (!sanitizedContent) {
      throw new Error('กรุณาระบุเนื้อหาข่าว');
    }
    payload.content = sanitizedContent;
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'date')) {
    payload.date = toIsoOrNull(updates.date) ?? payload.date;
  }

  let publishedUpdated = false;

  if (Object.prototype.hasOwnProperty.call(updates, 'published')) {
    const nextPublished = coerceBooleanInput(updates.published);

    if (nextPublished === null) {
      throw new Error('รูปแบบสถานะไม่ถูกต้อง');
    }

    payload.published = nextPublished;
    publishedUpdated = true;
  } else if (Object.prototype.hasOwnProperty.call(updates, 'status')) {
    const statusPublished = coerceBooleanInput(updates.status);

    if (statusPublished === null) {
      throw new Error('รูปแบบสถานะไม่ถูกต้อง');
    }

    payload.published = statusPublished;
    publishedUpdated = true;
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'displayFrom')) {
    payload.displayFrom = toIsoOrNull(updates.displayFrom);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'displayUntil')) {
    payload.displayUntil = toIsoOrNull(updates.displayUntil);
  }

  let imageToRemove = null;

  if (Object.prototype.hasOwnProperty.call(updates, 'removeImage') && updates.removeImage) {
    if (payload.imageUrl) {
      imageToRemove = payload.imageUrl;
    }
    payload.imageUrl = null;
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'imageUrl') && updates.imageUrl) {
    if (payload.imageUrl && payload.imageUrl !== updates.imageUrl) {
      imageToRemove = payload.imageUrl;
    }
    payload.imageUrl = updates.imageUrl;
  }

  const normalizedPayload = normalizeNews(payload);

  const scheduleUpdated =
    Object.prototype.hasOwnProperty.call(updates, 'displayFrom') ||
    Object.prototype.hasOwnProperty.call(updates, 'displayUntil');

  if (scheduleUpdated) {
    validateScheduleRange(normalizedPayload.displayFrom, normalizedPayload.displayUntil);
  }

  const updateDoc = {};
  if (Object.prototype.hasOwnProperty.call(updates, 'title')) {
    updateDoc.title = normalizedPayload.title;
  }
  if (Object.prototype.hasOwnProperty.call(updates, 'summary')) {
    updateDoc.summary = normalizedPayload.summary;
  }
  if (Object.prototype.hasOwnProperty.call(updates, 'content')) {
    updateDoc.content = normalizedPayload.content;
  }
  if (Object.prototype.hasOwnProperty.call(updates, 'date')) {
    updateDoc.date = normalizedPayload.date;
  }
  if (publishedUpdated) {
    updateDoc.published = normalizedPayload.published;
  }
  if (Object.prototype.hasOwnProperty.call(updates, 'displayFrom')) {
    updateDoc.displayFrom = normalizedPayload.displayFrom;
  }
  if (Object.prototype.hasOwnProperty.call(updates, 'displayUntil')) {
    updateDoc.displayUntil = normalizedPayload.displayUntil;
  }
  if (Object.prototype.hasOwnProperty.call(updates, 'removeImage')) {
    updateDoc.imageUrl = normalizedPayload.imageUrl;
  }
  if (Object.prototype.hasOwnProperty.call(updates, 'imageUrl')) {
    updateDoc.imageUrl = normalizedPayload.imageUrl;
  }

  if (
    publishedUpdated ||
    Object.prototype.hasOwnProperty.call(updates, 'displayFrom') ||
    Object.prototype.hasOwnProperty.call(updates, 'displayUntil') ||
    existing.status !== normalizedPayload.status ||
    !Object.prototype.hasOwnProperty.call(existing, 'status')
  ) {
    updateDoc.status = normalizedPayload.status;
  }

  if (Object.keys(updateDoc).length === 0) {
    throw new Error('ไม่พบข้อมูลที่ต้องการอัปเดต');
  }

  const { value } = await collection.findOneAndUpdate(
    { slug },
    { $set: updateDoc },
    { returnDocument: 'after' }
  );

  if (!value) {
    throw new Error('ไม่พบข่าวที่ต้องการปรับปรุง');
  }

  const { _id, ...rest } = value;
  const normalized = normalizeNews(rest);

  if (imageToRemove && imageToRemove !== normalized.imageUrl) {
    try {
      await deleteUploadedFile(imageToRemove);
    } catch (error) {
      console.warn('Failed to delete replaced news image', error);
    }
  }

  return normalized;
}

export async function deleteNews(slug) {
  const collection = await getCollection('news');
  const existing = await collection.findOne({ slug });

  if (!existing) {
    throw new Error('ไม่พบข่าวที่ต้องการลบ');
  }

  const result = await collection.deleteOne({ slug });

  if (result.deletedCount === 0) {
    throw new Error('ไม่พบข่าวที่ต้องการลบ');
  }

  if (existing.imageUrl) {
    try {
      await deleteUploadedFile(existing.imageUrl);
    } catch (error) {
      console.warn('Failed to delete news image', error);
    }
  }
}
