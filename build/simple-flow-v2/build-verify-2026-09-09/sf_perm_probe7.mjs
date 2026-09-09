import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const OUT='/home/user/Manual-test-Cases/build/simple-flow-v2/build-verify-2026-09-09';
const { browser, page } = await boot('sv8683','/administration/roles-permissions/af8d02b5-ecd1-4205-a82f-32a4d5bb1015/edit','admin');
await page.waitForTimeout(8000);
async function search(term){
  const box=await page.$('input[placeholder*="permission" i]');
  await box.fill(''); await page.waitForTimeout(500); await box.fill(term); await page.waitForTimeout(2000);
  const labs=await page.evaluate(()=>{const clean=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg,i,input,button').forEach(n=>n.remove());return (c.textContent||'').replace(/\s+/g,' ').trim();};
    // grab rows that look like toggle rows: contain a q-toggle
    const rows=[...document.querySelectorAll('.q-card, .row, .q-item, div')].filter(d=>d.querySelector('.q-toggle')&&d.querySelectorAll('.q-toggle').length<=3);
    return [...new Set(rows.map(clean).filter(t=>t&&t.length<80))];});
  return labs;
}
for(const term of ['order','pick','receiv','review','later','defer','complet']){
  console.log(term.toUpperCase()+':', JSON.stringify(await search(term)));
}
await browser.close();
