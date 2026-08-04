// Read the ON-SCREEN column headers of all six reports, live, on the new build.
import fs from 'fs';
import { boot, spaGo, APP } from './boot.mjs';
const SLUGS=['sales-by-customer','sales-by-representative','parts-velocity','technician-utilization','work-in-progress','inventory-value'];
const OUT=new URL('../evidence/screen/',import.meta.url).pathname;
fs.mkdirSync(OUT,{recursive:true});
const {browser,page,netlog}=await boot();
const res={build:'v3.4.1-3d03023',at:new Date().toISOString(),reports:{}};
for(const slug of SLUGS){
  await page.goto(APP+'/reports/'+slug,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(11000);
  const r=await page.evaluate(()=>{
    const txt=e=>(e.innerText||'').trim().replace(/\s+/g,' ');
    const vis=e=>{const b=e.getBoundingClientRect();return b.width>0&&b.height>0;};
    const main=document.querySelector('main')||document.body;
    const tables=Array.from(main.querySelectorAll('table')).filter(vis);
    const t=tables[0];
    const headers=t?Array.from(t.querySelectorAll('thead tr')).map(tr=>
      Array.from(tr.querySelectorAll('th,td')).map(th=>txt(th)
        .replace(/arrow_drop_(up|down)$/,'').replace(/arrow_(upward|downward)$/,'').trim())):[];
    // nav group headings, in order
    const navHeads=Array.from(document.querySelectorAll('*')).filter(e=>vis(e)&&e.children.length===0)
      .map(e=>txt(e)).filter(s=>/^[A-Z][A-Z &]{3,}$/.test(s));
    const filters=Array.from(main.querySelectorAll('.q-field,.q-select')).filter(vis).map(c=>txt(c)).filter(Boolean);
    const buttons=Array.from(main.querySelectorAll('button,.q-btn,[role=button]')).filter(vis)
      .map(b=>({t:txt(b),aria:b.getAttribute('aria-label'),title:b.getAttribute('title')})).filter(b=>b.t||b.aria||b.title);
    return {headerRows:headers, navHeadings:[...new Set(navHeads)], filters:[...new Set(filters)],
            buttons, bodyRows:t?t.querySelectorAll('tbody tr').length:0, url:location.pathname};
  });
  res.reports[slug]=r;
  await page.screenshot({path:OUT+slug+'.png',fullPage:false});
  fs.writeFileSync(OUT+slug+'-body.txt', await page.evaluate(()=>document.body.innerText));
  console.log('---',slug,'rows',r.bodyRows);
  console.log('   headers:',JSON.stringify(r.headerRows[r.headerRows.length-1]||[]));
  console.log('   nav    :',JSON.stringify(r.navHeadings));
}
fs.writeFileSync(OUT+'screen-columns.json',JSON.stringify(res,null,1));
fs.writeFileSync(OUT+'netlog.json',JSON.stringify(netlog,null,1));
await browser.close();
console.log('DONE');
