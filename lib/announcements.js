import { getCollection } from '@/lib/mongodb';

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

function normalizeAnnouncement(item) {
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

  return baseSlug || `announcement-${Date.now()}`;
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

async function fetchAllAnnouncementDocuments() {
  if (!process.env.MONGODB_URI) {
    return [
            {
                slug: 'policy-update-q3',
                title: 'ประกาศนโยบายการบริหารงานสาธารณสุข ไตรมาส 3/2567',
                summary: 'รายละเอียดการปรับปรุงขั้นตอนการให้บริการและมาตรฐานความปลอดภัยใหม่',
                date: new Date().toISOString(),
                content: 'เนื้อหาประกาศ...',
                published: true
            },
             {
                slug: 'emergency-protocol',
                title: 'แนวทางปฏิบัติกรณีฉุกเฉินทางการแพทย์ ฉบับปรับปรุง',
                summary: 'คู่มือสำหรับบุคลากรและประชาชนในการรับมือเหตุฉุกเฉินและภัยพิบัติ',
                date: new Date(Date.now() - 100000000).toISOString(),
                content: 'เนื้อหาประกาศ...',
                published: true
            }
        ].map(normalizeAnnouncement);
  }
  const collection = await getCollection('announcements');
  const documents = await collection.find({}).sort({ date: -1, slug: 1 }).toArray();
  return documents
    .map(({ _id, ...item }) => normalizeAnnouncement(item))
    .filter(Boolean);
}

export async function getAnnouncements({ includeHidden = false } = {}) {
  const announcements = await fetchAllAnnouncementDocuments();
  return announcements.filter((item) => shouldDisplay(item, includeHidden));
}

export async function getAnnouncementBySlug(slug, { includeHidden = false } = {}) {
  if (!process.env.MONGODB_URI) {
      const all = await fetchAllAnnouncementDocuments();
      const found = all.find(a => a.slug === slug);
      if (found) return found;

        return {
                slug: slug,
                title: 'ตัวอย่างประกาศทดสอบ',
                summary: 'เนื้อหาประกาศจำลอง...',
                date: new Date().toISOString(),
                content: 'เนื้อหาประกาศแบบเต็ม...',
                published: true
        };
  }
  const collection = await getCollection('announcements');
  const document = await collection.findOne({ slug });

  if (!document) {
    return null;
  }

  const { _id, ...rest } = document;
  const normalized = normalizeAnnouncement(rest);
  return shouldDisplay(normalized, includeHidden) ? normalized : null;
}

export async function addAnnouncement({ title, summary, content, date, displayFrom, displayUntil, imageUrl }) {
  if (!process.env.MONGODB_URI) {
    throw new Error('Cannot add announcement without database connection');
  }
  if (!title || !summary || !content) {
    throw new Error('กรุณาระบุข้อมูลประกาศให้ครบถ้วน');
  }

  const collection = await getCollection('announcements');
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

  const newAnnouncement = {
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

  const normalizedNew = normalizeAnnouncement(newAnnouncement);
  await collection.insertOne(normalizedNew);

  return normalizedNew;
}

export async function updateAnnouncement(slug, updates = {}) {
  if (!process.env.MONGODB_URI) {
    throw new Error('Cannot update announcement without database connection');
  }
  const collection = await getCollection('announcements');
  const existing = await collection.findOne({ slug });

  if (!existing) {
    throw new Error('ไม่พบประกาศที่ต้องการปรับสถานะ');
  }

  const { _id, ...rest } = existing;
  const payload = { ...rest };

  if (Object.prototype.hasOwnProperty.call(updates, 'title')) {
    const nextTitle = typeof updates.title === 'string' ? updates.title.trim() : '';
    if (!nextTitle) {
      throw new Error('กรุณาระบุหัวข้อประกาศ');
    }
    payload.title = nextTitle;
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'summary')) {
    const nextSummary = typeof updates.summary === 'string' ? updates.summary.trim() : '';
    if (!nextSummary) {
      throw new Error('กรุณาระบุสรุปประกาศ');
    }
    payload.summary = nextSummary;
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'content')) {
    const nextContent = typeof updates.content === 'string' ? updates.content.trim() : '';
    if (!nextContent) {
      throw new Error('กรุณาระบุเนื้อหาประกาศ');
    }
    payload.content = nextContent;
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'date')) {
    const isoDate = toIsoOrNull(updates.date);
    if (isoDate) {
      payload.date = isoDate;
    }
  }

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

  const normalizedPayload = normalizeAnnouncement(payload);
  validateScheduleRange(normalizedPayload.displayFrom, normalizedPayload.displayUntil);

  const updateDoc = {};
  if (Object.prototype.hasOwnProperty.call(updates, 'published')) {
    updateDoc.published = normalizedPayload.published;
  }
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

  const { value } = await collection.findOneAndUpdate(
    { slug },
    { $set: updateDoc },
    { returnDocument: 'after' }
  );

  if (!value) {
    throw new Error('ไม่พบประกาศที่ต้องการปรับสถานะ');
  }

  const { _id: updatedId, ...updated } = value;
  return normalizeAnnouncement(updated);
}

export async function deleteAnnouncement(slug) {
  if (!process.env.MONGODB_URI) {
    throw new Error('Cannot delete announcement without database connection');
  }
  const collection = await getCollection('announcements');
  const result = await collection.deleteOne({ slug });

  if (result.deletedCount === 0) {
    throw new Error('ไม่พบประกาศที่ต้องการลบ');
  }
}
