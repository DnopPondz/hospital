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

function createSlug(title) {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\u0E00-\u0E7F-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return baseSlug || `announcement-${Date.now()}`;
}

export async function getAnnouncements() {
  const announcements = await readAnnouncementsFile();
  return announcements
    .map((item) => ({
      ...item,
      date: item.date ?? new Date().toISOString()
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getAnnouncementBySlug(slug) {
  const announcements = await getAnnouncements();
  return announcements.find((item) => item.slug === slug) ?? null;
}

export async function addAnnouncement({ title, summary, content, date }) {
  if (!title || !summary || !content) {
    throw new Error('กรุณาระบุข้อมูลให้ครบถ้วน');
  }

  const announcements = await getAnnouncements();
  const requestedSlug = createSlug(title);

  let slug = requestedSlug;
  let counter = 1;
  while (announcements.some((item) => item.slug === slug)) {
    slug = `${requestedSlug}-${counter}`;
    counter += 1;
  }

  const parsedDate = date ? new Date(date) : new Date();
  const isoDate = !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : new Date().toISOString();

  const newAnnouncement = {
    title: title.trim(),
    slug,
    date: isoDate,
    summary: summary.trim(),
    content: content.trim()
  };

  const updatedAnnouncements = [newAnnouncement, ...announcements];
  await writeAnnouncementsFile(updatedAnnouncements);

  return newAnnouncement;
}
