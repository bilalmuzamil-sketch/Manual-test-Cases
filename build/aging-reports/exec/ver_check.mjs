// ver_check.mjs — 12 Nov 2026: read the QA site's build marker (is it still the build the held candidates were seen on?).
import { start, API } from './lib.mjs'; const s = await start(new URL('./ver/', import.meta.url).pathname);
const v = await s.page.evaluate(async (a) => { for (const u of [a + '/api/version', '/version.json', '/api/version']) { try { const r = await fetch(u, { credentials: 'include' }); const t = await r.text(); if (r.ok) return u + ' ' + t.slice(0, 200); } catch {} } return null; }, API);
const meta = await s.page.evaluate(() => [...document.querySelectorAll('meta, script[src]')].map((m) => m.getAttribute('content') || m.getAttribute('src')).filter((x) => /v\d+\.\d+/.test(x || '')).slice(0, 3));
console.log('ver', v, JSON.stringify(meta)); await s.close(); process.exit(0);
