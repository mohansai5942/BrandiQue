// Small, dependency-free helpers for handling untrusted values (Firestore content, form input,
// chatbot replies) before they reach the DOM or the database.

/** Returns the URL only when it is an absolute http(s) URL; otherwise the fallback. */
export function safeExternalUrl(value: unknown, fallback = ''): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  try {
    const url = new URL(trimmed);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : fallback;
  } catch {
    return fallback;
  }
}

/** Same-site path such as "/pricing" or "/services/ai-automation#faq". Rejects "//host" and "/\\host". */
export function safeInternalPath(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const path = value.trim();
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) return null;
  if (/[\u0000-\u001F\u007F\s]/.test(path)) return null;
  return path;
}

/** Media sources: https/http URLs or same-site paths only. */
export function safeMediaUrl(value: unknown): string {
  if (typeof value !== 'string') return '';
  return safeInternalPath(value) ?? safeExternalUrl(value);
}

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/**
 * Cleans free text from a form: removes control characters and HTML tags/angle brackets,
 * normalises whitespace on single-line fields, trims and caps the length.
 */
export function cleanText(value: unknown, maxLength: number, { multiline = false } = {}): string {
  if (typeof value !== 'string') return '';
  let text = value.replace(CONTROL_CHARS, '').replace(/<[^>]*>/g, '').replace(/[<>]/g, '');
  text = multiline ? text.replace(/\r\n?/g, '\n').replace(/\n{4,}/g, '\n\n\n') : text.replace(/\s+/g, ' ');
  return text.trim().slice(0, maxLength);
}

export const LIMITS = {
  name: 100,
  email: 254,
  phone: 20,
  message: 4000,
  short: 200,
} as const;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

export function isValidEmail(value: string): boolean {
  return value.length <= LIMITS.email && EMAIL_RE.test(value);
}

/** Accepts digits with optional leading +, spaces, dashes, dots and brackets; 7 to 15 digits. */
export function isValidPhone(value: string): boolean {
  if (!/^\+?[\d\s\-().]{7,20}$/.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

/** Turns a display phone number into a tel: target such as +917093320572. */
export function telHref(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '');
  return `tel:${cleaned}`;
}

/**
 * Firestore keeps retrying writes while the network is down, so an `await addDoc()` can hang
 * forever. Forms race it against a timeout so the visitor always gets a clear result.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (error) => { clearTimeout(timer); reject(error); },
    );
  });
}

export const SUBMIT_TIMEOUT_MS = 15000;
