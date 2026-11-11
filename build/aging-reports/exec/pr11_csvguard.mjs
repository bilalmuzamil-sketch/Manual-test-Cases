// pr11_csvguard.mjs — 11 Nov 2026 21:35 UTC: the Sales By Customer CSV is made by the SERVER (GET /api/reporting/reports/sales-by-customer/export,
// pr10). Does production's server (before the release) put an apostrophe before names starting with - = + @? Ask production's export for a wide
// date range (2020-01-01 to today, every location, summary + expanded), list every customer cell starting with ' - = + @ or a tab. Read-only.
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs'; import fs from 'fs';
const B = await bootProdLogin('/reports', { viewport: { width: 1440, height: 900 } }); const o = { version: B.version };
const IDS = ['555206ea-2a33-4ca1-a29a-5431b0f7648c', 'b617914c-16e9-4485-8e8b-193cd86aa416', 'c43fe73d-74e4-408c-83d7-92994b3fb2fe', 'c8c4d521-a93d-421d-aad1-6b9b1f0b014c'];
/* 21:38: the server allows 366 days at most - one year at a time, locations repeated */ for (const variant of ['summary', 'expanded']) for (const yr of [2021, 2022, 2023, 2024, 2025, 2026]) { const locs = IDS.map((i) => '&locations=' + i).join('');
  const u = `https://${B.APIH}/api/reporting/reports/sales-by-customer/export?variant=${variant}&format=csv&range=custom&start_date=${yr - 1}-11-12T07%3A00%3A00.000Z&end_date=${yr}-11-12T06%3A59%3A59.999Z&productType=all${locs}`;
  try { const r = await B.ctx.request.get(u, { headers: { Accept: 'text/csv,application/json' } }); const t = await r.text(); const lines = t.replace(/^﻿/, '').split(/\r?\n/);
    const hits = lines.filter((l) => /^"?['=+@\t-]/.test(l) || /^"'/.test(l)); o[variant + '-' + yr] = { st: r.status(), n: lines.length, head: lines.slice(0, 4), hits: hits.slice(0, 15) }; }
  catch (e) { o[variant + '-' + yr] = { err: String(e).slice(0, 200) }; } }
fs.writeFileSync(new URL('./prod/pr11.json', import.meta.url).pathname, JSON.stringify(o, null, 1)); console.log('pr11', JSON.stringify(o).slice(0, 3000)); await B.browser.close(); process.exit(0);
