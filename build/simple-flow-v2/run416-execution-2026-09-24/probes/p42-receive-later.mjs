// Section 6672: grant the "Receive later" permission to my own role, then look for the split button
// on a part that is Awaiting, in the row, and check the core sibling. Restore the permission afterwards.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ROLE='2a43e6cb-34ab-4475-bd02-242361a725f5';
const WO='79476028-70b2-44c7-9e34-0eddc62c15af'; // S2-925, part Awaiting, receiving required
const { browser, page } = await bootProdLogin('/workorders', { settle: 10000 });
page.setDefaultTimeout(25000);
const out = {};

async function receiveControl(tag) {
  await openWo(page, WO); await page.waitForTimeout(3500);
  const info = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button,.q-btn')].filter(b=>b.getBoundingClientRect().width);
    const recv = btns.filter(b => /^Receive/.test((b.innerText||'').trim()));
    return recv.map(b => { const parent = b.parentElement;
      return { text:(b.innerText||'').trim(),
        siblingButtons: parent ? [...parent.querySelectorAll('button,.q-btn')].map(x=>(x.innerText||'').trim()) : [],
        hasCaret: /arrow_drop_down|expand_more|caret/.test(parent ? parent.innerHTML : '') }; });
  });
  console.log(`[${tag}] Receive controls:`, JSON.stringify(info));
  const t = await bodyText(page);
  console.log(`[${tag}] the words "Receive later" on the page:`, t.includes('Receive later'), '| "Received later":', t.includes('Received later'));
  await page.screenshot({ path: `${EV}/C44592-receive-${tag}.png`, fullPage: true });
  return { info, hasWords: { receiveLater: t.includes('Receive later'), receivedLater: t.includes('Received later') } };
}
out.without = await receiveControl('permission-OFF');

// grant the permission
await page.goto(`https://app.shopview.com/administration/roles-permissions/${ROLE}/edit`, {waitUntil:'domcontentloaded'});
await page.waitForTimeout(10000);
const flipped = await page.evaluate(() => {
  let label = null;
  for (const el of document.querySelectorAll('*')) if (el.children.length===0 && (el.textContent||'').trim()==='Receive later') { label = el; break; }
  if (!label) return 'label not found';
  const row = label.closest('div[class*=row], li, tr') || label.parentElement;
  const tg = row.querySelector('.q-toggle') || row.parentElement?.querySelector('.q-toggle');
  if (!tg) return 'toggle not found';
  const was = tg.getAttribute('aria-checked');
  tg.scrollIntoView({block:'center'}); (tg.querySelector('input')||tg).click();
  return 'was ' + was;
});
console.log('granting Receive later ->', flipped);
await page.waitForTimeout(2000);
const saveBtn = page.locator('button:has-text("Save"), .q-btn:has-text("Save")').last();
await saveBtn.click({timeout:15000}).catch(e=>console.log('save:',e.message.split('\n')[0]));
await page.waitForTimeout(8000);
await page.screenshot({ path: `${EV}/C44592-role-saved.png` });

out.with = await receiveControl('permission-ON');
fs.writeFileSync(`${EV}/C44592-receive-later.json`, JSON.stringify(out,null,1));

// put the permission back off
await page.goto(`https://app.shopview.com/administration/roles-permissions/${ROLE}/edit`, {waitUntil:'domcontentloaded'});
await page.waitForTimeout(10000);
const back = await page.evaluate(() => {
  let label = null;
  for (const el of document.querySelectorAll('*')) if (el.children.length===0 && (el.textContent||'').trim()==='Receive later') { label = el; break; }
  if (!label) return 'label not found';
  const row = label.closest('div[class*=row], li, tr') || label.parentElement;
  const tg = row.querySelector('.q-toggle') || row.parentElement?.querySelector('.q-toggle');
  if (!tg) return 'toggle not found';
  if (tg.getAttribute('aria-checked') !== 'true') return 'already off';
  (tg.querySelector('input')||tg).click(); return 'turned back off';
});
console.log('restoring ->', back);
await page.locator('button:has-text("Save"), .q-btn:has-text("Save")').last().click({timeout:15000}).catch(()=>{});
await page.waitForTimeout(6000);
await browser.close();
