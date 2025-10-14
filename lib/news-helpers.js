export function formatThaiDate(value) {
  try {
    return new Intl.DateTimeFormat('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
}

function normalizeString(value) {
  if (!value) {
    return '';
  }
  return String(value).trim();
}

export function groupNewsByMonth(newsItems) {
  const groups = new Map();

  newsItems.forEach((item) => {
    const date = new Date(item.date);
    if (Number.isNaN(date.getTime())) {
      return;
    }
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        month: date.toLocaleString('th-TH', { month: 'long', year: 'numeric' }),
        items: []
      });
    }
    groups.get(key).items.push(item);
  });

  return Array.from(groups.values()).sort((a, b) => (a.key > b.key ? -1 : 1));
}

function toArray(value) {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeString(entry)).filter(Boolean);
  }
  return String(value)
    .split(',')
    .map((entry) => normalizeString(entry))
    .filter(Boolean);
}

export function deriveFilterOptions(newsItems) {
  const categories = new Set();
  const provinces = new Set();
  const importance = new Set();
  const tags = new Set();

  newsItems.forEach((item) => {
    if (item.category) {
      categories.add(item.category);
    }
    if (item.province) {
      provinces.add(item.province);
    }
    if (item.importance) {
      importance.add(item.importance);
    }
    toArray(item.tags).forEach((tag) => tags.add(tag));
  });

  return {
    categories: Array.from(categories).sort(),
    provinces: Array.from(provinces).sort(),
    importance: Array.from(importance),
    tags: Array.from(tags).sort()
  };
}

function includesKeyword(base, keyword) {
  return normalizeString(base).toLowerCase().includes(keyword);
}

export function filterNewsItems(newsItems, filters = {}) {
  const keyword = normalizeString(filters.search ?? '').toLowerCase();
  const category = normalizeString(filters.category ?? '');
  const province = normalizeString(filters.province ?? '');
  const importance = normalizeString(filters.importance ?? '');
  const tag = normalizeString(filters.tag ?? '');

  return newsItems.filter((item) => {
    if (keyword) {
      const haystacks = [item.title, item.summary, item.content, ...(item.tags ?? [])];
      const match = haystacks.some((haystack) => includesKeyword(haystack, keyword));
      if (!match) {
        return false;
      }
    }

    if (category && category !== 'all' && normalizeString(item.category) !== category) {
      return false;
    }

    if (province && province !== 'all' && normalizeString(item.province) !== province) {
      return false;
    }

    if (importance && importance !== 'all' && normalizeString(item.importance) !== importance) {
      return false;
    }

    if (tag && tag !== 'all') {
      const itemTags = toArray(item.tags);
      if (!itemTags.some((entry) => normalizeString(entry) === tag)) {
        return false;
      }
    }

    return true;
  });
}

export function importanceLabel(value) {
  const normalized = normalizeString(value).toLowerCase();
  switch (normalized) {
    case 'urgent':
      return 'เร่งด่วน';
    case 'high':
      return 'สำคัญ';
    default:
      return 'ทั่วไป';
  }
}
