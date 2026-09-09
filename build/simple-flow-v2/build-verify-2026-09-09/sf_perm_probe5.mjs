import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const { browser, page } = await boot('sv8683','/administration/roles-permissions','admin');
await page.waitForTimeout(7000);
// click the edit affordance on the Technician row (NOT admin)
const res=await page.evaluate(()=>{
  const rows=[...document.querySelectorAll('table tbody tr')];
  for(const tr of rows){ const t=(tr.textContent||'').replace(/\s+/g,' ').trim();
    if(/^Technician/i.test(t) && !/^admin/i.test(t)){
      const edit=[...tr.querySelectorAll('button,.q-btn,a,i')].find(e=>/edit/i.test(e.textContent||e.className||''));
      if(edit){edit.click();return 'clicked edit on: '+t.slice(0,30);}
      tr.querySelector('td:nth-child(2)')?.click(); return 'clicked row: '+t.slice(0,30);
    }}
  return 'no technician row';
});
console.log('ACTION:', res);
await page.waitForTimeout(6000);
console.log('URL:', page.url());
await page.screenshot({path:OUT+'/rp-editor-sv8683.png',fullPage:true}).catch(()=>{});
const toggles=await page.evaluate(()=>{const clean=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg,i').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();};return [...new Set([...document.querySelectorAll('.q-toggle,.q-checkbox,.q-item__label,label,.row .col')].map(clean).filter(t=>t&&t.length<70))];});
console.log('ALL TOGGLE-ISH LABELS:', JSON.stringify(toggles.filter(t=>/receiv|order|pick|financ|review|approv|create|edit|vendor|complet|line|part|invoice|permission|access/i.test(t))));
await browser.close();
