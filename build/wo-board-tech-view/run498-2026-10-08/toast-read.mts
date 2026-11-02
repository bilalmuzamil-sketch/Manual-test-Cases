/** toast-read.mts — 2 Nov 2026. The lead-change message shipped with SV-11524 is the design's own toast, not a Quasar .q-notification, so
 *  readers that look only at .q-notification report "no message" (old production run, C96957, 2 Nov). This reads any small visible box whose
 *  text is a lead-change / undo message, plus every .q-notification, as plain texts. New file; nothing else imports it. */
import type { Page } from 'playwright';
export const toastTexts = (pg: Page) => pg.evaluate(`(() => { const re = /S\\d+-\\d+ assigned to|moved to Unassigned|lead technician set|Assignment undone|Lead technician (updated|removed)|Couldn.t undo|Failed to update/i;
  const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const hits = [...document.querySelectorAll('body *')].filter(e => vis(e) && re.test(e.innerText || '') && (e.innerText || '').length < 220 && e.getBoundingClientRect().width < 700 && !/keyboard_arrow|Assigned to me/.test(e.innerText || ''));
  const top = hits.filter(e => !hits.some(o => o !== e && o.contains(e)));
  const q = [...document.querySelectorAll('.q-notification')].filter(vis);
  return [...new Set([...top, ...q].map(e => e.innerText.replace(/\\s+/g, ' ').replace(/^(check_circle|check|warning|error|info)\\s*/, '').replace(/\\s*close$/i, '').trim()))]; })()`) as Promise<string[]>;
