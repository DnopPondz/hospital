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

function toOptionalString(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeAnnouncement(item) {
  const isoDate = toIsoOrNull(item.date) ?? new Date().toISOString();

  return {
    ...item,
    date: isoDate,
    image: toOptionalString(item?.image),
    imageAlt: toOptionalString(item?.imageAlt),
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

  return baseSlug || `announcement-${Date.now()}`;
}

let announcementsSeeded = false;

async function maybeSeedAnnouncements(collection) {
  if (announcementsSeeded) {
    return;
  }

  announcementsSeeded = true;

  try {
    const count = await collection.estimatedDocumentCount();
    if (count > 0) {
      return;
    }

    const seedModule = await import('../data/announcements.json', { assert: { type: 'json' } });
    const seedData = Array.isArray(seedModule?.default) ? seedModule.default : [];

    if (seedData.length === 0) {
      return;
    }

    const normalizedSeed = seedData.map((item) => normalizeAnnouncement(item));
    if (normalizedSeed.length > 0) {
      await collection.insertMany(normalizedSeed);
    }
  } catch (error) {
    console.warn('ไม่สามารถ seed ประกาศตัวอย่างลง MongoDB ได้', error);
  }
}

async function getAnnouncementsCollection() {
  const db = await getDatabase();
  const collection = db.collection('announcements');
  await maybeSeedAnnouncements(collection);
  return collection;
}

function mapAnnouncementDocument(doc) {
  const { _id, ...rest } = doc;
  const normalized = normalizeAnnouncement(rest);
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

export async function getAnnouncements({ includeHidden = false } = {}) {
  try {
    const collection = await getAnnouncementsCollection();
    const query = buildVisibilityFilter(includeHidden);
    const documents = await collection.find(query).sort({ date: -1 }).toArray();
    return documents.map((doc) => mapAnnouncementDocument(doc));
  } catch (error) {
    console.error('ไม่สามารถดึงข้อมูลประกาศจาก MongoDB ได้', error);
    return [];
  }
}

export async function getAnnouncementBySlug(slug, { includeHidden = false } = {}) {
  try {
    const collection = await getAnnouncementsCollection();
    const document = await collection.findOne({ slug });

    if (!document) {
      return null;
    }

    const announcement = mapAnnouncementDocument(document);

    if (includeHidden) {
      return announcement;
    }

    if (!announcement.published) {
      return null;
    }

    const now = Date.now();
    const startsAt = announcement.displayFrom ? new Date(announcement.displayFrom).getTime() : null;
    const endsAt = announcement.displayUntil ? new Date(announcement.displayUntil).getTime() : null;

    if (startsAt && startsAt > now) {
      return null;
    }

    if (endsAt && endsAt < now) {
      return null;
    }

    return announcement;
  } catch (error) {
    console.error('ไม่สามารถดึงประกาศตาม slug จาก MongoDB ได้', error);
    return null;
  }
}

export async function addAnnouncement({
  title,
  summary,
  content,
  date,
  displayFrom,
  displayUntil,
  image,
  imageAlt
}) {
  if (!title || !summary || !content) {
    throw new Error('กรุณาระบุข้อมูลให้ครบถ้วน');
  }

  const collection = await getAnnouncementsCollection();
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

  const newAnnouncement = normalizeAnnouncement({
    title: title.trim(),
    slug,
    date: date ?? new Date().toISOString(),
    summary: summary.trim(),
    content: content.trim(),
    published: true,
    displayFrom: sanitizedDisplayFrom,
    displayUntil: sanitizedDisplayUntil,
    image,
    imageAlt
  });

  const result = await collection.insertOne(newAnnouncement);
  return mapAnnouncementDocument({ ...newAnnouncement, _id: result.insertedId });
}

export async function updateAnnouncement(slug, updates = {}) {
  const collection = await getAnnouncementsCollection();
  const existing = await collection.findOne({ slug });

  if (!existing) {
    throw new Error('ไม่พบประกาศที่ต้องการปรับสถานะ');
  }

  const { _id, ...rest } = existing;
  const next = { ...rest };

  if (Object.prototype.hasOwnProperty.call(updates, 'published')) {
    next.published = Boolean(updates.published);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'displayFrom')) {
    next.displayFrom = toIsoOrNull(updates.displayFrom);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'displayUntil')) {
    next.displayUntil = toIsoOrNull(updates.displayUntil);
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'image')) {
    next.image = updates.image;
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'imageAlt')) {
    next.imageAlt = updates.imageAlt;
  }

  const normalized = normalizeAnnouncement(next);
  validateScheduleRange(normalized.displayFrom, normalized.displayUntil);

  await collection.updateOne({ _id }, { $set: normalized });
  return mapAnnouncementDocument({ ...normalized, _id });
}

export async function deleteAnnouncement(slug) {
  const collection = await getAnnouncementsCollection();
  const result = await collection.deleteOne({ slug });

  if (result.deletedCount === 0) {
    throw new Error('ไม่พบประกาศที่ต้องการลบ');
  }
}
