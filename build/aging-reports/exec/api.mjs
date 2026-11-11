// api.mjs — 11 Nov 2026: tiny API helpers through the signed-in page (cookies included). get(u) / post(u, body) -> {st, j}.
import { API } from './lib.mjs';
export const mk = (page) => ({
  get: (u) => page.evaluate(async (u) => { const r = await fetch(u, { credentials: 'include', headers: { Accept: 'application/json' } }); let j = null; try { j = await r.json(); } catch {} return { st: r.status, j }; }, API + u),
  post: (u, b) => page.evaluate(async ([u, b]) => { const r = await fetch(u, { method: 'POST', credentials: 'include', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(b) }); let j = null; try { j = await r.json(); } catch {} return { st: r.status, j }; }, [API + u, b]),
});
