/** How does the location menu switch back? Screenshot every step (2026-10-08). */
import { open, done, APP } from './session.mts';
import { shot, t } from './wob.mts';
const { browser, page: p } = await open('/workorders');
await p.goto(APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
const where = () => p.evaluate(`(document.querySelector('header') || document.body).innerText.split('\\n').find(l => / - \\d{3,5}$/.test(l)) || null`);
console.log(t(), 'now', await where());
await p.locator('header').getByText(/^[A-Z]{2}$/).last().click(); await p.waitForTimeout(1500); await shot(p, 'probe-loc-1-menu');
const cur = p.locator('.q-menu').getByText(/ - \d{3,5}$/).first(); console.log(t(), 'current button', await cur.innerText());
await cur.click(); await p.waitForTimeout(1500); await shot(p, 'probe-loc-2-options');
const opts = await p.evaluate(`[...document.querySelectorAll('.q-menu')].map((m, i) => i + ': ' + m.innerText.replace(/\\s+/g, ' ').slice(0, 300))`);
console.log(t(), 'menus', JSON.stringify(opts));
const target = /Lethbridge/.test(String(await where())) ? 'Staging Heavy Duty - 9919' : 'Staging Lethbridge - 4310';
const cand = p.locator('.q-menu .q-item').filter({ hasText: target });
console.log(t(), 'candidates for', target, await cand.count(), JSON.stringify(await cand.allInnerTexts()));
await cand.last().click(); await p.waitForTimeout(2000); await shot(p, 'probe-loc-3-after-pick');
console.log(t(), 'dialogs', JSON.stringify(await p.evaluate(`[...document.querySelectorAll('.q-dialog')].map(d => d.innerText.replace(/\\s+/g, ' ').slice(0, 300))`)));
await p.waitForTimeout(5000); console.log(t(), 'now', await where(), p.url().replace(APP, ''));
await done(browser);
