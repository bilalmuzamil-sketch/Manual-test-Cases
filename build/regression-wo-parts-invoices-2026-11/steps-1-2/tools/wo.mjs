// On-screen work order actions for the regression flows. SECRET-FREE.
import { APP, sleep } from './common.mjs';
export const CUST_A = { id: 'ab32fdf2-4227-4a00-ab46-6a64c162959f', name: 'ZZAUTOTEST RGWO Customer A' };
const tid = (page, id) => page.locator(`[data-test-id="${id}"]`).first();
const inp = (page, id) => page.locator(`[data-test-id="${id}"] input, input[data-test-id="${id}"], [data-test-id="${id}"] textarea, textarea[data-test-id="${id}"]`).first();
export { tid, inp };
export async function createWO(page, { customer = CUST_A.name, unit, vin }) {
  await page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 60000 }); await sleep(5000);
  await tid(page, 'button_new_work_order').click({ force: true }); await sleep(2500);
  await tid(page, 'select_customer_select').click({ force: true }); await sleep(500);
  await page.keyboard.type(customer.slice(0, 15), { delay: 40 }); await sleep(2500);
  await page.locator('.q-menu .q-item', { hasText: customer }).first().click({ force: true }); await sleep(2000);
  await tid(page, 'button_add_vehicle').click({ force: true }); await sleep(2500);
  await tid(page, 'select_vehicle_contact').click({ force: true }); await sleep(1200);
  await page.locator('.q-menu .q-item').first().click({ force: true }); await sleep(800);
  await inp(page, 'input_vehicle_vin').fill(vin); await inp(page, 'input_unit').fill(unit);
  await tid(page, 'select_vehicle_make').click({ force: true }); await sleep(800); await page.keyboard.type('Freightl', { delay: 40 }); await sleep(2000);
  await page.locator('.q-menu .q-item').first().click({ force: true }); await sleep(800);
  await tid(page, 'button_save_vehicle').scrollIntoViewIfNeeded(); await tid(page, 'button_save_vehicle').click({ force: true }); await sleep(3500);
  await tid(page, 'button_save_work_order').click({ force: true }); await sleep(3500);
  const create = page.locator('.q-dialog button', { hasText: /^\s*Create\s*$/ }).first();
  if (await create.count()) { await create.click({ force: true }); await sleep(3500); }
  await sleep(2000);
  const m = page.url().match(/workorders\/([0-9a-f-]{36})/);
  return m ? m[1] : null;
}
export async function closeAnyDialog(page) {
  for (let i = 0; i < 3; i++) { const x = page.locator('.q-dialog [data-test-id="button_close_dialog"], .q-dialog i:text-is("close")').first(); if (await x.count()) { await x.click({ force: true }).catch(() => {}); await sleep(1000); } else break; }
}
export async function ids(page, scope = '') {
  return page.evaluate((s) => [...new Set([...document.querySelectorAll(s + ' [data-test-id]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }).map(e => e.getAttribute('data-test-id') + (e.innerText && e.innerText.length < 50 ? '«' + e.innerText.replace(/\s+/g, ' ').trim() + '»' : '')))], scope);
}
