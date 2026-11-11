// wake_sv11315.mjs — 11 Nov 2026: wakes the sv11315 QA site when it has gone to sleep (L0599 recipe): open
// https://sleep.qa.shopview.com/?app=sv11315&api=sv11315, click "Wake Up", then poll quick-login until it answers 200 (up to 3 min).
import { chromium } from 'playwright'; import fs from 'fs';
const b = await chromium.launch(); const p = await b.newPage(); await p.goto('https://sleep.qa.shopview.com/?app=sv11315&api=sv11315', { waitUntil: 'domcontentloaded' }).catch(() => {});
await p.waitForTimeout(2000); const btn = p.getByRole('button', { name: /Wake Up/i }); const had = await btn.count(); if (had) await btn.first().click().catch(() => {});
const S = fs.readFileSync('/tmp/qa-cookies/sv11315-sso.txt', 'utf8').trim().replace(/^sv_sso_session=/, ''); let st = 0;
for (let i = 0; i < 36 && st !== 200; i++) { await p.waitForTimeout(5000); st = await fetch('https://sv11315api.qa.shopview.com/api/quick-login/users', { headers: { Cookie: 'sv_sso_session=' + S }, redirect: 'manual' }).then((r) => r.status).catch(() => 0); }
console.log(new Date().toISOString().slice(11, 19), 'wake', JSON.stringify({ button: had, status: st })); await b.close(); process.exit(0);
