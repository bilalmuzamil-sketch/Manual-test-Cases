// SV-11940 staging half: Parts Velocity "Last 90 days" — the window the screen sends (server-side request, with offset),
// the Date Range printed on the PDF/CSV, and the day count, with all four zones recorded.
// Usage: TZ=<zone> node sv11940_staging.mjs DVI|HD
import { boot, rule99, LOC, sleep, save, OUT } from './common.mjs';
import fs from 'fs'; import { execFileSync } from 'child_process';
const key = process.argv[2]; const loc = LOC[key]; const APP = 'https://app.staging.shopview.com';
const D = `${OUT}/SV-11940`; fs.mkdirSync(D, { recursive: true });
const r = await boot(loc); const page = r.page;
const reqs = []; page.on('request', q => { const u = q.url(); if (u.includes('api.staging') && /parts-velocity/.test(u)) reqs.push({ t: new Date().toISOString(), m: q.method(), u: u.replace('https://api.staging.shopview.com', '') }); });
// fresh defaults: forget any remembered range (SV-11514 remembers it per browser)
await page.goto(APP + '/reports', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(3000);
await page.evaluate(() => Object.keys(localStorage).filter(k => /report_|velocity/.test(k)).forEach(k => localStorage.removeItem(k)));
await page.goto(APP + '/reports/parts-velocity', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(12000);
const chips = await page.evaluate(() => [...document.querySelectorAll('.q-chip, [class*="chip"]')].map(e => e.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 8));
const shot = `${D}/parts-velocity-${key}-last90.png`; await page.screenshot({ path: shot });
const menu = () => page.locator('.q-menu').last();
async function download(kind) {
  await page.locator('.q-page button').filter({ hasText: 'more_horiz' }).first().click().catch(() => {}); await sleep(1500);
  const it = menu().getByText(new RegExp('Download \\(' + kind + '\\)')).first(); if (!(await it.count())) return { missing: true };
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 120000 }).catch(() => null), it.click()]); if (!dl) return { error: 'no download' };
  const tmp = `/tmp/cln/r105/pv-${key}.${kind.toLowerCase()}`; await dl.saveAs(tmp);
  const text = kind === 'PDF' ? execFileSync('pdftotext', ['-layout', '-f', '1', '-l', '1', tmp, '-']).toString() : fs.readFileSync(tmp, 'utf8');
  const out = { name: dl.suggestedFilename(), date_range_line: text.split('\n').map(s => s.trim()).find(s => /Date Range/i.test(s)) || null };
  if (kind === 'PDF') { const png = `${D}/parts-velocity-${key}-pdf-top`; execFileSync('pdftoppm', ['-png', '-r', '80', '-f', '1', '-l', '1', '-y', '0', '-H', '260', '-W', '1000', '-singlefile', tmp, png]); out.picture = png.replace(OUT + '/', '') + '.png'; }
  return out;
}
const pdf = await download('PDF'); await sleep(2000); const csv = await download('CSV');
const win = reqs.map(x => { const m = x.u.match(/start_date=([^&]+).*end_date=([^&]+)/); return m ? { start: decodeURIComponent(m[1]), end: decodeURIComponent(m[2]), u: x.u.slice(0, 160) } : null; }).filter(Boolean);
// independent count of days on the location's calendar for the window the screen sent (machine tz database)
const count = win.length ? JSON.parse(execFileSync('python3', ['-I', '-c', `import json,datetime as d;from zoneinfo import ZoneInfo as Z
s=d.datetime.fromisoformat('${win[0].start}'.replace('Z','+00:00')).astimezone(Z('${loc.tz}'));e=d.datetime.fromisoformat('${win[0].end}'.replace('Z','+00:00')).astimezone(Z('${loc.tz}'))
t=d.datetime.now(Z('${loc.tz}')).date()
print(json.dumps({'first_day_local':str(s.date()),'last_day_local':str(e.date()),'start_local':s.isoformat(),'end_local':e.isoformat(),'days_inclusive':(e.date()-s.date()).days+1,'today_local':str(t),'expected_first_day_today_minus_89':str(t-d.timedelta(days=89))}))`]).toString()) : null;
const res = { ticket: 'SV-11940', location: loc.name, zone: loc.tz, rule99_start: r.rule99, chips, screenshot: shot.replace(OUT + '/', ''), request_windows: win, independent_count: count, pdf, csv, rule99_end: await rule99(page, loc) };
save(`${D}/staging-${key}-${new Date().toISOString().slice(0, 16).replace(/:/g, '')}Z.json`, res);
console.log(JSON.stringify({ chips, win: win.slice(0, 2), count, pdf: pdf.date_range_line, csv: csv.date_range_line, z: res.rule99_end }, null, 1));
await r.browser.close();
