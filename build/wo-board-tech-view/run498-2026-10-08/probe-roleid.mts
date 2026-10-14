/** 15 Oct 2026 — read-only: which request does Administration > Roles & Permissions use on staging, and what is the id of
 *  "ZZAUTOTEST WO View Only"? (the organisation role list answers empty on staging, so analytics-batch could not find it). */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts';
import { EV } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all');
const seen: any[] = [];
p.on('response', async (r) => { if (r.request().method() === 'GET' && /\/api\/.*role/i.test(r.url())) { let b = ''; try { b = await r.text(); } catch {} seen.push({ url: r.url().replace(/^https:\/\/[^/]+/, ''), status: r.status(), hit: b.includes('ZZAUTOTEST WO View Only'), body: b.slice(0, 300), idNear: (b.match(/.{0,200}ZZAUTOTEST WO View Only.{0,200}/) || [''])[0] }); } });
await p.goto(APP + '/administration/roles-permissions', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(9000);
const row = p.getByText('ZZAUTOTEST WO View Only').first(); const has = await row.count(); if (has) { await row.click().catch(() => {}); await p.waitForTimeout(5000); }
const out = { has, url: p.url(), seen };
fs.writeFileSync(path.join(EV, 'probe-roleid.json'), JSON.stringify(out, null, 1)); console.log(JSON.stringify(out, null, 1).slice(0, 5000));
await done(browser);
