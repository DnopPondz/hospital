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

function normalizeAnnouncement(item) {
  const parsedDate = item.date ? new Date(item.date) : new Date();
  const isoDate = !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : new Date().toISOString();

  return {
    ...item,
    date: isoDate,
    published: item?.published !== false
  };
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
    .filter((item) => includeHidden || item.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getAnnouncementBySlug(slug, { includeHidden = false } = {}) {
  const announcements = await getAnnouncements({ includeHidden });
  return announcements.find((item) => item.slug === slug) ?? null;
}

export async function addAnnouncement({ title, summary, content, date }) {
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

  const newAnnouncement = {
    title: title.trim(),
    slug,
    date: date ?? new Date().toISOString(),
    summary: summary.trim(),
    content: content.trim(),
    published: true
  };

  const normalizedNew = normalizeAnnouncement(newAnnouncement);
  const updatedAnnouncements = [normalizedNew, ...announcements].map((item) => normalizeAnnouncement(item));
  await writeAnnouncementsFile(updatedAnnouncements);

  return normalizedNew;
}

export async function setAnnouncementVisibility(slug, published) {
  const announcements = await readAnnouncementsFile();

  let found = false;
  const updated = announcements.map((item) => {
    if (item.slug !== slug) {
      return normalizeAnnouncement(item);
    }

    found = true;
    return normalizeAnnouncement({ ...item, published: Boolean(published) });
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
