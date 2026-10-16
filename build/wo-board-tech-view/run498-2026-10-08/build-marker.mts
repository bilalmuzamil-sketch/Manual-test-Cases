/** 16 Oct 2026 — print the staging build marker the way the app shows it (vNN.NN.NN-<7 chars>), read-only. /api/version answers a full
 *  40-character commit, which wob-run.sh hides as a possible secret; this prints the app's own short marker and the commit's first 7. */
import { open, done } from './session.mts'; import { api } from './data.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); await p.waitForTimeout(5000);
const v = String((await a.get('/api/version')).body?.version ?? ''); const shown = await p.evaluate(`(document.body.innerText.match(/v\\d+\\.\\d+\\.\\d+-[0-9a-f]{7}/) || [null])[0]`);
const meta = await p.evaluate(`[...document.querySelectorAll('meta')].map(m => (m.name || m.getAttribute('property') || '') + '=' + (m.content || '')).filter(x => /version|build/i.test(x)).join(' | ')`);
console.log('BUILD api-commit7=' + v.slice(0, 7) + ' api-tail=' + v.replace(/^[0-9a-f]{20,}/, '') + ' shown=' + shown + ' meta=' + meta); await done(browser);
