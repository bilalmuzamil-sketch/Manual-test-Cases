// usage: [ENV=prod] TAG= node listshot.mjs -> Work Orders list on screen: All tab, search, sort Clocked In descending; rows + screenshot; prefs restored
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const S=JSON.parse(fs.readFileSync(`/tmp/sv12112/seed-${ENV}.json`,'utf8')); const OUT='ev/'+process.env.TAG; fs.mkdirSync(OUT,{recursive:true});
const s=await sess(); const p=s.page; await s.go('/workorders'); await p.waitForTimeout(5000); const R={marker:await s.marker()};
const PREF='/api/users/me/preferences/work-orders-list'; const before=(await s.api(PREF)).json?.data; R.prefBefore=before;
R.tabs=await p.evaluate(()=>[...document.querySelectorAll('.q-tab')].map(t=>t.innerText.replace(/\s+/g,' ').trim()+'|'+(t.getAttribute('data-test-id')||'')));
if(before?.value?.display&&before.value.display!=='list'){ await p.click('[data-test-id="display_option_list"]'); await p.waitForTimeout(3500); }
if((before?.value?.filters?.assigned_to_me||[]).length){ await p.click('[data-test-id="filter_chip_assigned_to_me"]'); await p.waitForTimeout(3000); }
await p.click('[data-test-id="tab_all"]'); await p.waitForTimeout(3500);
const SEARCH=process.env.SEARCH||''; if(SEARCH){ await p.click('[data-test-id="page_search_toggle"]'); await p.waitForTimeout(1200); await p.keyboard.type(SEARCH,{delay:60}); await p.waitForTimeout(4000); R.searchBox=await p.evaluate(()=>{const i=document.activeElement; return (i?.getAttribute('data-test-id')||i?.closest('[data-test-id]')?.getAttribute('data-test-id')||'')+'='+(i?.value||'');}); }
const h=p.locator('th',{hasText:/Clocked In/i}).first(); const reqs=[]; p.on('request',r=>{ if(/\/api\/work-orders\?/.test(r.url())) reqs.push(decodeURIComponent(r.url()).match(/sortBy\]=(\w+)&pagination\[descending\]=(\w+)/)?.slice(1).join(' ')); });
for(let i=0;i<3;i++){ await h.click(); await p.waitForTimeout(3500); if(reqs.at(-1)==='clockedInTechnicians '+(process.env.DIR==='asc'?'false':'true')) break; }
R.sortRequests=reqs;
R.rows=await p.evaluate(()=>{ const hs=[...document.querySelectorAll('thead th')].map(t=>t.innerText.replace(/arrow_drop_\w+/,'').trim()); const ni=hs.findIndex(x=>/^Number/.test(x)), ci=hs.findIndex(x=>/^Clocked In/.test(x));
  return [...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent).map(r=>{const td=r.querySelectorAll('td'); return {number:td[ni]?.innerText.trim(),clockedIn:td[ci]?.innerText.replace(/\s+/g,' ').trim()};}).slice(0,30); });
await p.screenshot({path:OUT+'/list-sorted-'+(process.env.DIR||'desc')+'.png'});
R.boxes=await p.evaluate(()=>{ const hs=[...document.querySelectorAll('thead th')]; const c=hs.find(t=>/Clocked In/.test(t.innerText)); const r=c?.getBoundingClientRect(); return {clockedHeader:r?[r.x,r.y,r.width,r.height]:null, rows:[...document.querySelectorAll('tbody tr')].filter(x=>x.offsetParent).slice(0,30).map(x=>{const b=x.getBoundingClientRect(); return [x.innerText.match(/S[\w-]*\d{3,}/)?.[0]||'',b.x,b.y,b.width,b.height];})}; });
const now=(await s.api(PREF)).json?.data; if(ENV==='prod'&&JSON.stringify(now)!==JSON.stringify(before)){ const r=await s.api(PREF,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({value:before?.value??before})}); R.prefRestore=r.status; R.prefAfter=(await s.api(PREF)).json?.data; R.prefSame=JSON.stringify(R.prefAfter)===JSON.stringify(before); }
fs.writeFileSync(OUT+'/result-'+(process.env.DIR||'desc')+'.json',JSON.stringify(R,null,1)); console.log(JSON.stringify({marker:R.marker.version,tabs:R.tabs,inputs:R.inputs,sort:R.sortRequests,rows:R.rows.slice(0,14),prefRestore:R.prefRestore,prefSame:R.prefSame},null,0).slice(0,3000));
await s.close(); process.exit(0);
