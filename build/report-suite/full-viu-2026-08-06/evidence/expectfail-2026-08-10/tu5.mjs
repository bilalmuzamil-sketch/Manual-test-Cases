import {boot,APP} from './boot2.mjs';
const {browser,page}=await boot();
const reqs=[];
page.on('request',r=>{const u=r.url(); if(u.includes('/api/reporting/reports/technician-utilization')&&!u.includes('/daily')) reqs.push(u.replace(/^https:\/\/[^/]+/,''));});
await page.goto(APP+'/reports/technician-utilization',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(9000);
const snap=()=>page.evaluate(()=>({
  names:[...document.querySelectorAll('tbody tr')].map(r=>{const td=r.querySelector('td');return td?td.innerText.replace(/keyboard_arrow_\w+/,'').trim():'';}).filter(Boolean),
  icons:[...document.querySelectorAll('thead th')].map(t=>{const s=t.querySelector('.tu-sort-label');const i=t.querySelector('.report-sort-icon,.report-sort-icon--active');
    return s?{col:s.getAttribute('data-test-id'),cls:i?i.className.replace('q-icon notranslate material-icons ',''):null}:null}).filter(Boolean)
}));
const s0=await snap(); console.log('LOAD order:',JSON.stringify(s0.names));
console.log('LOAD icons:',JSON.stringify(s0.icons,null,0));
const cols=[['Technician','header_tu_technician'],['Total Hours','header_tu_total_hours'],['WO Hours','header_tu_wo_hours'],['Internal Hours','header_tu_internal_hours'],['Utilization %','header_tu_utilization'],['Est. Lost Labor','header_tu_est_lost_labor']];
for (const [label,tid] of cols){
  for (const pass of [1,2,3]){
    const b=reqs.length;
    const loc=page.locator(`[data-test-id="${tid}"]`).first();
    const n=await loc.count();
    if(!n){console.log(`${label}: NO CONTROL data-test-id=${tid}`);break;}
    await loc.click();
    await page.waitForTimeout(2000);
    const s=await snap();
    const ic=s.icons.find(x=>x.col===tid);
    console.log(`${label} click#${pass} reqs=${reqs.length-b} icon="${ic?ic.cls:'?'}" order=${JSON.stringify(s.names.slice(0,4))}`);
  }
}
console.log('TOTAL report reqs (excl daily) since load:',reqs.length);
reqs.forEach(r=>console.log('   ',r.slice(0,150)));
await browser.close();
