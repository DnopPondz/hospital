import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'announcements.json');

async function readAnnouncementsFile() {
  const data = await fs.readFile(dataFilePath, 'utf8');
  const parsed = JSON.parse(data);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeAnnouncementsFile(announcements) {
  await fs.writeFile(dataFilePath, JSON.stringify(announcements, null, 2), 'utf8');
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

export async function getAnnouncements({ includeHidden = false } = {}) {
  const announcements = await readAnnouncementsFile();
  return announcements
    .map((item) => normalizeAnnouncement(item))
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

export async function getAnnouncementBySlug(slug, { includeHidden = false } = {}) {
  const announcements = await getAnnouncements({ includeHidden });
  return announcements.find((item) => item.slug === slug) ?? null;
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

  const announcements = await getAnnouncements({ includeHidden: true });
  const requestedSlug = createSlug(title);

  let slug = requestedSlug;
  let counter = 1;
  while (announcements.some((item) => item.slug === slug)) {
    slug = `${requestedSlug}-${counter}`;
    counter += 1;
  }

  const sanitizedDisplayFrom = toIsoOrNull(displayFrom);
  const sanitizedDisplayUntil = toIsoOrNull(displayUntil);

  validateScheduleRange(sanitizedDisplayFrom, sanitizedDisplayUntil);

  const newAnnouncement = {
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
  };

  const normalizedNew = normalizeAnnouncement(newAnnouncement);
  const updatedAnnouncements = [normalizedNew, ...announcements].map((item) => normalizeAnnouncement(item));
  await writeAnnouncementsFile(updatedAnnouncements);

  return normalizedNew;
}

export async function updateAnnouncement(slug, updates = {}) {
  const announcements = await readAnnouncementsFile();

  let found = false;
  const updated = announcements.map((item) => {
    if (item.slug !== slug) {
      return normalizeAnnouncement(item);
    }

    found = true;

    const next = { ...item };

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
    return normalized;
  });

  if (!found) {
    throw new Error('ไม่พบประกาศที่ต้องการปรับสถานะ');
  }

  await writeAnnouncementsFile(updated);
  return normalizeAnnouncement(updated.find((item) => item.slug === slug));
}

export async function deleteAnnouncement(slug) {
  const announcements = await readAnnouncementsFile();
  const filtered = announcements.filter((item) => item.slug !== slug);

  if (filtered.length === announcements.length) {
    throw new Error('ไม่พบประกาศที่ต้องการลบ');
  }

  const normalized = filtered.map((item) => normalizeAnnouncement(item));
  await writeAnnouncementsFile(normalized);
}
