import { open, ensureOpen, type as tp, SEL } from '/home/user/Manual-test-Cases/build/global-search/run415-execution/gs_probe.mjs';
const API='https://sv9160api.qa.shopview.com';
const { page, browser } = await open('sv9160','/workorders','admin');
await page.waitForTimeout(2200);
const get=(u)=>page.evaluate(async(u)=>{const r=await fetch(u,{credentials:'include'});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch{};return j},API+u);
const show=async(lbl)=>{const r=await get('/api/search?q=ZZPRXQ');
  const g=(r?.data?.groups||[]).find(x=>x.type==='parts');
  console.log(lbl);
  (g?.items||[]).forEach((i,n)=>console.log('   ',n+1,String(i.primary).slice(0,26).padEnd(26),'score',i.score));};
await show('--- before');
// view Gamma the way a user does: click it in the search panel
await ensureOpen(page); await tp(page,'Gamma ZZPRXQ',3000);
await page.evaluate(()=>{const t=[...document.querySelectorAll('.search-tabs__tab')].find(x=>/^Parts/i.test(x.innerText.trim())); if(t)t.click();});
await page.waitForTimeout(1300);
const rows=await page.$$(SEL.row);
console.log('rows offered:',rows.length);
if(rows.length){ await rows[0].click(); await page.waitForTimeout(7000); console.log('landed on',page.url().replace('https://sv9160.qa.shopview.com','')); }
await page.waitForTimeout(4000);
const rec=await get('/api/user/recent-entities');
const seen=(rec?.data?.items||[]).some(i=>/Gamma ZZPRXQ/i.test(String(i.primary)));
console.log('INSTRUMENT CHECK - Gamma now in the recently-viewed list:',seen);
if(!seen){ console.log('-> still no view recorded; the experiment cannot be run this way either'); }
else { await show('--- after Gamma was viewed'); }
await browser.close();
