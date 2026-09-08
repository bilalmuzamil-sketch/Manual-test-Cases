import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/inline-add-edit-parts/build-verify-2026-09-08';
const { browser, page } = await boot('sv9315', '/administration/roles-permissions', 'admin');
await page.waitForTimeout(6000);
console.log('build:', await page.evaluate(()=>document.querySelector('meta[name=app-version]')?.content));
console.log('url:', page.url());
// enumerate role rows -> open first editable one's edit
const rows = await page.evaluate(()=>{
  const out=[];
  document.querySelectorAll('a,button,tr,[role=row]').forEach(e=>{
    const t=(e.textContent||'').trim();
    if(t && /edit/i.test(t) && t.length<60) out.push(t);
  });
  return [...new Set(out)].slice(0,15);
});
console.log('edit-ish controls:', JSON.stringify(rows));
// Try clicking a role name to reach its edit; look for links to /edit
const editHref = await page.evaluate(()=>{
  const a=[...document.querySelectorAll('a')].find(x=>/roles-permissions\/\d+\/edit/.test(x.getAttribute('href')||''));
  return a?a.getAttribute('href'):null;
});
console.log('editHref:', editHref);
if(editHref){ await page.goto('https://sv9315.qa.shopview.com'+editHref,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(6000); }
else {
  // click first row then an Edit action
  const r=page.locator('tr,[role=row]').filter({hasText:/./}).nth(1);
  await r.click().catch(()=>{});
  await page.waitForTimeout(3000);
  const eb=page.locator('button:has-text("Edit"),a:has-text("Edit")').first();
  await eb.click().catch(()=>{});
  await page.waitForTimeout(6000);
}
console.log('edit url:', page.url());
const body = await page.evaluate(()=>document.body.innerText);
const targets=['Roles & Permissions','Work orders','View mode','Full View','Tech view','Create & Edit','Work order lines','See Financial Data','View and Manage AP/AR Data','Delete','Reset To Template'];
const found={}; for(const t of targets){ found[t]= body.includes(t); }
console.log('LABELS:', JSON.stringify(found,null,1));
// section headers verbatim
const heads = await page.evaluate(()=>{
  const out=[];
  document.querySelectorAll('h1,h2,h3,h4,h5,.section-title,[class*=section]').forEach(e=>{
    const t=(e.textContent||'').trim(); if(t&&t.length<50) out.push(t);
  });
  return [...new Set(out)].slice(0,40);
});
console.log('HEADERS:', JSON.stringify(heads));
import fs from 'fs';
fs.mkdirSync(OUT,{recursive:true});
await page.screenshot({path:OUT+'/roleedit-v26.35.9.png', fullPage:true}).catch(()=>{});
fs.writeFileSync(OUT+'/roleedit-body-v26.35.9.txt', body);
await browser.close();
