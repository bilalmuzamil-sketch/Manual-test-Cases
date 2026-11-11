// locsw_check.mjs — 11 Nov 2026 19:52: proof for the locsw.mjs fix (Rule 129): Heavy Duty -> Lethbridge -> Heavy Duty through the screen, header read back each time.
import { start } from './lib.mjs'; import { ensureLoc } from './locsw.mjs';
const s = await start(new URL('./locsw_check/', import.meta.url).pathname, '/reports/ar-aging-summary'); const p = s.page; const H = async () => (await p.locator('header').innerText()).replace(/\s+/g, ' ').slice(-40); const out = [await H()];
for (const n of ['Staging Lethbridge - 4310', 'Staging Heavy Duty - 9919']) { try { await ensureLoc(p, n); out.push('ok ' + (await H())); } catch (e) { out.push('FAIL ' + String(e).slice(0, 150)); } }
console.log('locsw_check', JSON.stringify(out)); await s.close(); process.exit(0);
