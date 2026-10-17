import * as Sentry from '@sentry/react';

// Pings the BrandiQue Data Console so admins get a phone notification for new form submissions.
// The API re-reads the document server-side and notifies only once per fresh submission.
export function notifyAdmin(collection: 'messages' | 'n8n_project_forms', id: string) {
  if (!id || typeof fetch === 'undefined') return;
  try {
    void fetch('https://data.brandique.in/api/notify-submission', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify({ collection, id }),
      keepalive: true,
      mode: 'cors',
    }).catch((err) => { Sentry.captureException(err); });
  } catch (err) { Sentry.captureException(err); /* never block the form */ }
}
