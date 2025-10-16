export function sanitizeRichText(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  let sanitized = html;

  // Remove script, style, and iframe tags entirely
  sanitized = sanitized.replace(/<(script|style|iframe)[^>]*>[\s\S]*?<\/\1>/gi, '');

  // Remove event handler attributes such as onclick="..."
  sanitized = sanitized.replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, '');
  sanitized = sanitized.replace(/\son[a-z]+\s*=\s*'[^']*'/gi, '');
  sanitized = sanitized.replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '');

  // Neutralize javascript: URLs in href or src attributes
  sanitized = sanitized.replace(/(href|src)\s*=\s*"javascript:[^"]*"/gi, '$1="#"');
  sanitized = sanitized.replace(/(href|src)\s*=\s*'javascript:[^']*'/gi, '$1="#"');
  sanitized = sanitized.replace(/(href|src)\s*=\s*javascript:[^\s>]+/gi, '$1="#"');

  return sanitized.trim();
}
