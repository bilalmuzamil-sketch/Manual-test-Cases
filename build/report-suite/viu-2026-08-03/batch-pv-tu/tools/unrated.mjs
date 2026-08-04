import { login, api } from './qa8582.mjs';
import { boot } from './boot8582.mjs';
import { APP } from './qa8582.mjs';
import fs from 'fs';
const OUT='../evidence/tu/unrated'; fs.mkdirSync(OUT,{recursive:true});
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a', LE='f8a8b802-7780-4b16-bf10-343caeb616b2';
const R={buildMarker:'v3.4.1-0ed4433', at:new Date().toISOString(),
  method:'temporarily clear the Heavy Duty default Labour Type, observe the em-dash / partial-valuation / sort / Summary behaviour, then restore and verify'};
let t=await login('admin'); let S=t.sessCookie;
const types=(await api(S,'GET','/api/labour-types?pagination[rowsPerPage]=200')).body.data.collection;
const def=types.find(x=>x.is_default && x.workplaceId===HD);
R.hdDefaultBefore={id:def.id, name:def.name, rate:def.labour_rate, is_default:def.is_default,
  productAndServiceId:def.productAndServiceId};
console.log('HD default labour type:', JSON.stringify(R.hdDefaultBefore));
const tu=async(qs)=>{const r=await api(S,'GET','/api/reporting/reports/technician-utilization?'+qs);
 return (r.body?.data?.collection||[]).map(x=>({n:x.technician_name, int:x.internal_seconds, ell:x.est_lost_labor_cents, loc:x.location}));};
R.before={hdOnly: await tu(`range=this_month&locations=${HD}`), both: await tu(`range=this_month&locations=${HD},${LE}`)};
// FLIP
const chg=async(isDef)=>await api(S,'POST','/api/labour-types/change',{labour_type_id:def.id, name:def.name, labour_rate:def.labour_rate,
  is_default:isDef, product_and_service_id:def.productAndServiceId});
R.flipOff=(await chg(false)).status;
await new Promise(z=>setTimeout(z,1500));
const t2=(await api(S,'GET','/api/labour-types?pagination[rowsPerPage]=200')).body.data.collection.find(x=>x.id===def.id);
R.afterFlipRead={is_default:t2.is_default, rate:t2.labour_rate};
R.after={hdOnly: await tu(`range=this_month&locations=${HD}`), both: await tu(`range=this_month&locations=${HD},${LE}`),
  thisYearHd: (await tu(`range=this_year&locations=${HD}`)).slice(0,6)};
console.log('AFTER FLIP hdOnly:', JSON.stringify(R.after.hdOnly));
console.log('AFTER FLIP both  :', JSON.stringify(R.after.both));
// UI observation of the em-dash + sorting
if(R.after.hdOnly.some(x=>x.ell===null)||R.after.both.some(x=>x.ell===null)){
  const {browser,page}=await boot('admin');
  await page.goto(APP+'/reports/technician-utilization',{waitUntil:'domcontentloaded',timeout:60000}); await page.waitForTimeout(9000);
  const rows=()=>page.$$eval('tbody tr',trs=>trs.map(tr=>[...tr.querySelectorAll('td,th')].map(td=>td.innerText.replace(/\n/g,' ').trim())).filter(r=>r.join('')));
  R.uiEmDash={rows: await rows()};
  R.emDashAria = await page.evaluate(()=>{const tds=[...document.querySelectorAll('tbody td')].filter(td=>td.innerText.trim()==='—');
    return tds.slice(0,3).map(td=>({aria:td.getAttribute('aria-label'), sr:td.querySelector('.sr-only,[class*=visually]')?.innerText||null, title:td.getAttribute('title'), html:td.innerHTML.slice(0,180)}));});
  await page.screenshot({path:`${OUT}/tu-emdash.png`});
  // sort Est. Lost Labor asc then desc
  const click=async tid=>{const e=await page.$(`[data-test-id="${tid}"]`); const b=await e.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2); await page.waitForTimeout(2200);};
  await click('header_tu_est_lost_labor'); R.sortAsc={rows:(await rows()).map(r=>r[0]+' | '+r[r.length-1])};
  await page.screenshot({path:`${OUT}/tu-emdash-sort-asc.png`});
  await click('header_tu_est_lost_labor'); R.sortDesc={rows:(await rows()).map(r=>r[0]+' | '+r[r.length-1])};
  await page.screenshot({path:`${OUT}/tu-emdash-sort-desc.png`});
  // exports carrying the em-dash
  const eb=await page.$('[aria-label="Export report"]'); const bb=await eb.boundingBox(); await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await page.waitForTimeout(900);
  const dlp=page.waitForEvent('download',{timeout:45000}).catch(()=>null);
  const its=await page.$$('.q-menu .q-item'); for(const it of its){const tx=await it.evaluate(e=>e.innerText.trim()); if(tx==='Summary (CSV)'){const b2=await it.boundingBox(); await page.mouse.click(b2.x+b2.width/2,b2.y+b2.height/2); break;}}
  const d=await dlp; if(d){await d.saveAs(`${OUT}/tu-emdash-summary.csv`); R.exportFile=d.suggestedFilename();}
  await browser.close();
}
// RESTORE
t=await login('admin'); S=t.sessCookie;
R.flipBack=(await chg(true)).status;
await new Promise(z=>setTimeout(z,1500));
const t3=(await api(S,'GET','/api/labour-types?pagination[rowsPerPage]=200')).body.data.collection.find(x=>x.id===def.id);
R.restoreVerify={is_default:t3.is_default, rate:t3.labour_rate, name:t3.name, matchesOriginal: t3.is_default===true && Number(t3.labour_rate)===Number(def.labour_rate) && t3.name===def.name};
R.afterRestore={hdOnly: await tu(`range=this_month&locations=${HD}`)};
console.log('RESTORED:', JSON.stringify(R.restoreVerify), '| ELL back:', JSON.stringify(R.afterRestore.hdOnly));
fs.writeFileSync(`${OUT}/unrated-location.json`,JSON.stringify(R,null,1));
console.log('\n', JSON.stringify({emDashRows:R.uiEmDash?.rows, sortAsc:R.sortAsc, sortDesc:R.sortDesc, emDashAria:R.emDashAria},null,1).slice(0,3000));
