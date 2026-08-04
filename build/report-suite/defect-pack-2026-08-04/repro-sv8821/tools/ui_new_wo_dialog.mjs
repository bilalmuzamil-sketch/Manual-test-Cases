// ui_new_wo_dialog.mjs — inspect the product's own "New Work Order" dialog to see whether a CONTACT
// is a required field there. This decides whether a real user can even create the contactless work
// order that SV-8821's 500 needs (Rule 51 reachability test), and therefore whether the ticket's
// Steps to reproduce can be written for a person clicking the product at all.
import fs from 'fs';
import { boot } from '../../../viu-2026-08-03/tools/boot8582.mjs';
import { APP } from '../../../viu-2026-08-03/tools/qa8582.mjs';
const OUT = '/tmp/sv8821/ui-newwo'; fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await boot('admin', { workplaceId: 'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
await page.goto(APP + '/workorders', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(7000);
await page.screenshot({ path: `${OUT}/01-list.png`, fullPage: true });
const btns = await page.locator('button').allInnerTexts().catch(() => []);
console.log('BUTTONS ON THE WORK ORDERS PAGE:', JSON.stringify(btns.map(b => b.trim().replace(/\s+/g, ' ')).filter(Boolean)));

const newBtn = page.locator('button').filter({ hasText: /^(New Work Order|New Service Order|New Order|Create Work Order|New)$/i }).first();
let bb = await newBtn.boundingBox().catch(() => null);
if (!bb) {
  const alt = page.locator('button').filter({ hasText: /New/i }).first();
  bb = await alt.boundingBox().catch(() => null);
}
if (!bb) { console.log('!! no New Work Order button found'); }
else {
  await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `${OUT}/02-dialog.png`, fullPage: true });
  const dlg = await page.locator('.q-dialog:visible').innerText().catch(() => '');
  console.log('\n=== NEW WORK ORDER DIALOG ===\n' + dlg.replace(/\n{2,}/g, '\n').slice(0, 2000));
  const fields = await page.evaluate(() => {
    const d = document.querySelector('.q-dialog');
    if (!d) return [];
    return [...d.querySelectorAll('.q-field')].map(f => ({
      label: (f.querySelector('label, .q-field__label')?.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60),
      required: !!f.querySelector('[required]') || f.className.includes('required') || (f.innerText || '').includes('*'),
      value: (f.querySelector('input,textarea')?.value || '').slice(0, 40),
    }));
  });
  console.log('\n=== DIALOG FIELDS ===');
  fields.forEach(f => console.log('  ', (f.required ? 'REQUIRED' : 'optional'), '|', f.label, f.value ? '| value=' + f.value : ''));
  const mentionsContact = /contact/i.test(dlg);
  console.log('\ndialog mentions a "Contact" field:', mentionsContact);
}
await browser.close();
console.log('evidence:', OUT);
