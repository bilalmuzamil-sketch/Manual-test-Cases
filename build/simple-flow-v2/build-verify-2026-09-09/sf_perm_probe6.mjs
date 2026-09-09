import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const { browser, page } = await boot('sv8683','/administration/roles-permissions/af8d02b5-ecd1-4205-a82f-32a4d5bb1015/edit','admin');
await page.waitForTimeout(8000);
// dump ALL permission toggle row labels by scrolling the whole permissions panel
const all=await page.evaluate(()=>{
  const clean=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg,i,.q-toggle__inner').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();};
  // toggle rows are label text next to a q-toggle
  const out=[];
  document.querySelectorAll('.q-toggle').forEach(tg=>{
    const row=tg.closest('.row,.q-item,div');
    const label=row?clean(row):'';
    if(label && label.length<60) out.push(label);
  });
  return [...new Set(out)];
});
console.log('ALL PERMISSION TOGGLES:', JSON.stringify(all));
// use the search permission box for "receiv"
const box=await page.$('input[placeholder*="permission" i], input[aria-label*="permission" i]');
if(box){ await box.fill('receiv'); await page.waitForTimeout(2500);
  const hit=await page.evaluate(()=>{const clean=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg,i').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();};return [...document.querySelectorAll('.q-toggle')].map(tg=>{const r=tg.closest('.row,.q-item,div');return r?clean(r):'';}).filter(t=>t&&/receiv/i.test(t));});
  console.log('SEARCH "receiv" HITS:', JSON.stringify([...new Set(hit)]));
  await page.screenshot({path:OUT+'/rp-search-receiv-sv8683.png',fullPage:true}).catch(()=>{});
}
await browser.close();
