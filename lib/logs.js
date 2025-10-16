import { getCollection } from '@/lib/mongodb';

const VALID_TYPES = new Set(['news', 'announcement']);

function sanitizeType(type) {
  if (!type || typeof type !== 'string') {
    return null;
  }

  const normalized = type.trim().toLowerCase();
  return VALID_TYPES.has(normalized) ? normalized : null;
}

function sanitizeSlug(slug) {
  if (!slug || typeof slug !== 'string') {
    return null;
  }

  const trimmed = slug.trim();
  return trimmed || null;
}

function sanitizeTitle(title) {
  if (!title || typeof title !== 'string') {
    return null;
  }

  const trimmed = title.trim();
  return trimmed || null;
}

function toIsoString(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

export async function recordReadEvent({ type, slug, title }) {
  const normalizedType = sanitizeType(type);
  const normalizedSlug = sanitizeSlug(slug);
  const normalizedTitle = sanitizeTitle(title);

  if (!normalizedType || !normalizedSlug) {
    return;
  }

  try {
    const collection = await getCollection('readLogs');
    await collection.insertOne({
      type: normalizedType,
      slug: normalizedSlug,
      title: normalizedTitle,
      readAt: new Date()
    });
  } catch (error) {
    // Logging failures must never block the main request lifecycle.
    console.error('Failed to record read event', error);
  }
}

export async function getReadStatistics({ limit = 50 } = {}) {
  const collection = await getCollection('readLogs');

  const [totals, leaderboard, recent] = await Promise.all([
    collection
      .aggregate([
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ])
      .toArray(),
    collection
      .aggregate([
        {
          $group: {
            _id: { type: '$type', slug: '$slug', title: '$title' },
            count: { $sum: 1 },
            lastReadAt: { $max: '$readAt' }
          }
        },
        { $sort: { lastReadAt: -1, count: -1 } },
        { $limit: limit }
      ])
      .toArray(),
    collection
      .find({})
      .sort({ readAt: -1 })
      .limit(limit)
      .toArray()
  ]);

  const totalsByType = totals.reduce(
    (acc, { _id: type, count }) => {
      if (type === 'news') {
        acc.news = count;
      } else if (type === 'announcement') {
        acc.announcements = count;
      }
      acc.total += count;
      return acc;
    },
    { total: 0, news: 0, announcements: 0 }
  );

  const leaderboardItems = leaderboard.map((item) => ({
    type: item._id?.type || 'news',
    slug: item._id?.slug || '',
    title: item._id?.title || '',
    count: item.count || 0,
    lastReadAt: toIsoString(item.lastReadAt)
  }));

  const recentItems = recent.map(({ _id, readAt, ...rest }) => ({
    ...rest,
    readAt: toIsoString(readAt)
  }));

  return {
    totals: totalsByType,
    leaderboard: leaderboardItems,
    recent: recentItems
  };
}
