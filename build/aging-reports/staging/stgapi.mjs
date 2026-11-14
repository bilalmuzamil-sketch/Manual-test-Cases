// stgapi.mjs — 14 Nov 2026: GET/POST on the staging API with the QA lead's session from stglib (ctx.request; Origin/Referer + x-location-id =
// the test browser's location, Heavy Duty by default). Same {st, j} shape as exec/api.mjs so the sv11315 seeding recipes can be reused.
import { API, APP } from './stglib.mjs';
export function mkS(s, loc = 'b3c8c820-f815-4cf1-8938-10956c5ee71a') {
  const H = { Accept: 'application/json', Origin: APP, Referer: APP + '/', 'x-location-id': loc };
  const wrap = async (r) => { let j = null; try { j = await r.json(); } catch {} return { st: r.status(), j }; };
  return { get: async (p) => wrap(await s.ctx.request.get(API + p, { headers: H })), post: async (p, b) => wrap(await s.ctx.request.post(API + p, { headers: { ...H, 'Content-Type': 'application/json' }, data: b })) };
}
