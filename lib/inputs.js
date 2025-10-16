const TRUTHY_STRINGS = new Set([
  'true',
  '1',
  'yes',
  'y',
  'on',
  'enable',
  'enabled',
  'active',
  'activated',
  'publish',
  'published',
  'show',
  'showing',
  'visible',
  'display',
  'displayed',
  'open',
  'opening',
  'schedule',
  'scheduled',
  'start',
  'started',
  'live',
  'ใช้งาน',
  'แสดง',
  'เปิด'
]);

const FALSY_STRINGS = new Set([
  'false',
  '0',
  'no',
  'n',
  'off',
  'disable',
  'disabled',
  'inactive',
  'deactivate',
  'deactivated',
  'draft',
  'hidden',
  'hide',
  'hiding',
  'archive',
  'archived',
  'unpublish',
  'unpublished',
  'stop',
  'stopped',
  'close',
  'closed',
  'closing',
  'expire',
  'expired',
  'ไม่แสดง',
  'ยกเลิก',
  'ปิด'
]);

function normalizeString(value) {
  return value.normalize('NFKC').trim().toLowerCase();
}

export function coerceBooleanInput(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    if (Number.isNaN(value)) {
      return null;
    }
    return value !== 0;
  }

  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    const normalized = normalizeString(value);

    if (!normalized) {
      return null;
    }

    if (TRUTHY_STRINGS.has(normalized)) {
      return true;
    }

    if (FALSY_STRINGS.has(normalized)) {
      return false;
    }

    return null;
  }

  return null;
}

export function normalizeOptionalDateInput(value) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (!trimmed) {
      return null;
    }

    const lowered = trimmed.toLowerCase();
    if (lowered === 'null' || lowered === 'undefined') {
      return null;
    }

    return trimmed;
  }

  return value;
}
