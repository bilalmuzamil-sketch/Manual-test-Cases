// QA lead, 2026-09-03: "Always seed data, never stay blocked." (Rule 14.)
// Six Credit Invoice cases need credits in states this account does not have. Before seeding, look at
// the three controls the UI offers - Issue Credit (toolbar), and Cash Out / Reverse on a credit row -
// and read what each dialog asks for. UI first (2026-09-02 rule); nothing is submitted in this pass.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const CUST='039fd202-c7f5-4b34-8000-969488b49687';
const { browser, page, APP, APIH } = await boot('sv8218', '/customers', 'admin');
const out={ at:new Date().toISOString(), dialogs:{} };
const calls=[]; page.on('request',r=>{const u=r.url(); if(u.includes(APIH)) calls.push(`${r.method()} ${u.replace(`https://${APIH}`,'')}`);});
await page.goto(`${APP}/customers/${CUST}/invoices`,{waitUntil:'domcontentloaded'});
await page.waitForTimeout(9000);
out.build = await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content);

const readDialog = async () => page.evaluate(() => {
  const d=[...document.querySelectorAll('.q-dialog, [role="dialog"]')].pop(); if(!d) return null;
  const lab=el=>{const c=el.cloneNode(true);c.querySelectorAll('svg,i,[class*="icon"],[aria-hidden="true"]').forEach(n=>n.remove());
    return (c.textContent||'').replace(/\s+/g,' ').trim();};
  return { title: lab(d).slice(0,120),
    fields:[...d.querySelectorAll('label, .q-field__label')].map(lab).filter(Boolean),
    inputs:[...d.querySelectorAll('input, textarea, select')].map(i=>({type:i.type||i.tagName, name:i.name||null, ph:i.placeholder||null, val:(i.value||'').slice(0,30)})),
    buttons:[...d.querySelectorAll('button, .q-btn')].map(lab).filter(Boolean),
    text: lab(d).slice(0,400) };
});
const esc = async () => { await page.keyboard.press('Escape'); await page.waitForTimeout(1200); };

// 1) the toolbar's Issue Credit
const ic = page.locator('button:has-text("Issue Credit")').first();
if (await ic.count()) { await ic.click(); await page.waitForTimeout(3000);
  out.dialogs.issueCredit = await readDialog(); console.log('ISSUE CREDIT ->', JSON.stringify(out.dialogs.issueCredit,null,1).slice(0,900)); await esc(); }
else console.log('no Issue Credit button');

// 2) the credit row's Cash Out and Reverse
const n = await page.evaluate(()=>{ const t=document.querySelector('table'); if(!t) return 0;
  for (const tr of t.querySelectorAll('tbody tr')) { const x=(tr.textContent||'').toLowerCase();
    if (!x.includes('credit')||!x.includes('cm')) continue;
    const cell=tr.cells[tr.cells.length-1];
    const c=[...cell.querySelectorAll('button,[role="button"],.q-btn')]; c.forEach((e,i)=>e.setAttribute('data-qa-a',String(i))); return c.length; }
  return 0; });
console.log('credit row action buttons:', n);
for (let i=0;i<n;i++){
  await page.locator(`[data-qa-a="${i}"]`).first().hover().catch(()=>{});
  await page.waitForTimeout(800);
  const tip=await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip,[role="tooltip"]')].map(e=>(e.textContent||'').trim()).filter(Boolean));
  if (tip.some(t=>/print/i.test(t))) { console.log(`[${i}] ${JSON.stringify(tip)} - skipping, already known`); continue; }
  console.log(`[${i}] ${JSON.stringify(tip)} - opening`);
  await page.locator(`[data-qa-a="${i}"]`).first().click().catch(e=>console.log('   click:',String(e).split('\n')[0]));
  await page.waitForTimeout(3000);
  const d = await readDialog();
  out.dialogs[tip[0]||('ctl'+i)] = d;
  console.log('   ->', JSON.stringify(d,null,1).slice(0,800));
  await esc();
}
fs.writeFileSync('build/invoice-ui-refresh/seed-2026-09-03/dialogs.json', JSON.stringify(out,null,1));
await browser.close();
