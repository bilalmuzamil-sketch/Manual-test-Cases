/** loc-make-1028.mts — 28 Oct 2026 (Rule 107, SV-11555 / C682436 set-up): make a location on screen (Settings > Locations > New Location),
 *  recording every API call the Save makes and the dialog's fields/errors, so a failed save names its reason. LOC_NAME env = the name.
 *  Output EV/loc-make-<name>.json + pictures EV/LOC-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done, APP } from './session.mts'; import { api } from './data.mts'; import { EV, t } from './wob.mts';
const { browser, page: p } = await open('/workorders'); p.setDefaultTimeout(20_000); const a = api(p);
const LOC = process.env.LOC_NAME || ({ B: 'ZZAUTOTEST F2 No Tech Shop', C: 'ZZAUTOTEST Location Empty' } as any)[process.env.ONLY || 'C'] || 'ZZAUTOTEST Location Empty'; const o: any = { at: new Date().toISOString(), name: LOC, calls: [] as any[] }; // wob-run.sh keeps ONLY (no spaces) and drops LOC_NAME: ONLY=B or C
p.on('response', async (r) => { if (r.request().method() !== 'GET' && /\/api\//.test(r.url())) o.calls.push({ m: r.request().method(), url: r.url().replace(/^https?:\/\/[^/]+/, ''), status: r.status(), body: (await r.text().catch(() => '')).slice(0, 300), sent: (r.request().postData() || '').slice(0, 400) }); });
const wps = async () => ((d: any) => (Array.isArray(d) ? d : d?.collection ?? []))((await a.get('/api/workplaces')).body?.data) as any[];
o.before = (await wps()).map((w) => w.name);
if (!o.before.includes(LOC)) {
  await p.goto(APP + '/administration/locations', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  await p.screenshot({ path: path.join(EV, 'LOC-list.png') });
  await p.locator('button').filter({ hasText: /New Location/i }).first().click(); await p.waitForTimeout(3000);
  const d = p.locator('.q-dialog').last();
  o.fields = await d.evaluate((e) => [...e.querySelectorAll('.q-field')].map((f) => (f as HTMLElement).innerText.replace(/\s+/g, ' ').trim().slice(0, 60)));
  await d.locator('.q-field').filter({ hasText: /Name \*/ }).first().locator('input').fill(LOC);
  const fill = async (lab: RegExp, v: string) => { const i = d.locator('.q-field').filter({ hasText: lab }).first().locator('input').first(); await i.click(); await i.fill(v); await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(300); };
  await fill(/Address 1/, '3 ZZAUTOTEST Way'); await fill(/^City|City/, 'Las Vegas'); await fill(/ZIP|Postal/, '89135');
  const ph = d.locator('.q-field').filter({ hasText: /Telephone|Phone/ }).first().locator('input').first(); await ph.click(); await p.keyboard.type('7025550199', { delay: 30 });
  const pick = async (lab: RegExp, typed: string, item: string) => { const f = d.locator('.q-field').filter({ hasText: lab }).first(); await f.click(); await p.waitForTimeout(800); await p.keyboard.type(typed, { delay: 40 }); await p.waitForTimeout(1500); await p.locator('.q-menu .q-item').filter({ hasText: item }).first().click().catch(() => {}); await p.waitForTimeout(800); };
  await pick(/^Country|Country/, 'United States', 'United States'); // 28 Oct: Country is required and comes before State/Province
  await pick(/State|Province/, 'Nevada', 'Nevada'); await pick(/Timezone/, 'Karachi', 'Asia/Karachi');
  await p.screenshot({ path: path.join(EV, 'LOC-filled.png') });
  await d.locator('button').filter({ hasText: /^\s*Save & Close\s*$/ }).last().click().catch(async () => { await d.locator('button').filter({ hasText: /Save/ }).last().click(); });
  await p.waitForTimeout(5000); await p.screenshot({ path: path.join(EV, 'LOC-after-save.png') });
  o.errors = await p.evaluate(`[...document.querySelectorAll('.q-field--error, .q-field__messages, .q-notification')].map(e => e.innerText.replace(/\\s+/g,' ').trim()).filter(Boolean)`);
}
o.after = (await wps()).find((w) => w.name === LOC) ?? null;
fs.writeFileSync(path.join(EV, `loc-make-${LOC.replace(/\W+/g, '-')}.json`), JSON.stringify(o, null, 1)); console.log(t(), JSON.stringify(o).slice(0, 3000)); await done(browser);
