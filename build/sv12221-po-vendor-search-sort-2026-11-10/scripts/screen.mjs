// ENV TAG SEARCH CLICKS(vendor header clicks)
import {sess} from './common.mjs'; import fs from 'fs';
const TAG=process.env.TAG; const s=await sess(); const p=s.page; await s.go('/parts/orders'); await p.waitForTimeout(4000);
const vh=p.locator('thead th',{hasText:/^Vendor/}).first();
for(let i=0;i<+(process.env.CLICKS||0);i++){ await vh.click(); await p.waitForTimeout(2500); }
if(process.env.SEARCH){ await p.click('[data-test-id="page_search_toggle"]'); await p.keyboard.type(process.env.SEARCH); await p.waitForTimeout(3500); }
const rows=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>[...r.querySelectorAll('td')].map(td=>td.innerText.trim()))).then(rs=>rs.map(r=>r.slice(1,4).join(' | ')));
const geo=await p.evaluate(()=>{ const r=e=>{if(!e)return null;const b=e.getBoundingClientRect();return [Math.round(b.x),Math.round(b.y),Math.round(b.right),Math.round(b.bottom)];};
  const th=[...document.querySelectorAll('thead th')].find(t=>/^Vendor/.test(t.innerText.trim())); const tds=[...document.querySelectorAll('tbody tr')].map(tr=>tr.querySelectorAll('td')[3]).filter(Boolean);
  const inp=document.querySelector('input[type=search], .q-field input'); const empty=[...document.querySelectorAll('*')].find(e=>/No data|No results|No purchase orders|nothing/i.test(e.innerText||'')&&e.children.length===0);
  return {th:r(th),col:tds.length?[r(tds[0])[0],r(tds[0])[1],r(tds[0])[2],r(tds[Math.min(tds.length-1,11)])[3]]:null,input:r(inp),empty:empty?[empty.innerText.trim(),r(empty)]:null};});
const ver=await p.evaluate(()=>document.querySelector('meta[name="app-version"]')?.content);
await p.screenshot({path:`../ev/${TAG}.png`}); const o={TAG,env:process.env.ENV||'branch',ver,search:process.env.SEARCH||'',clicks:process.env.CLICKS||0,url:p.url(),n:rows.length,rows:rows.slice(0,14),geo,at:new Date().toISOString()};
console.log(JSON.stringify(o,null,0).slice(0,1500)); fs.appendFileSync('../ev/screen-runs.jsonl',JSON.stringify(o)+'\n'); await s.browser.close();
