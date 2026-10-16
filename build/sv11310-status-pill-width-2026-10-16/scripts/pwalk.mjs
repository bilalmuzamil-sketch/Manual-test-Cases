import {open} from './qa.mjs'; import fs from 'fs';
const s=await open({env:'prod',dir:'/tmp/qa11310',user:'bilal.muzamil@shopview.com',vp:{width:1600,height:1000},dpr:2}); const p=s.page; const mk=await s.marker();
await s.go('/customers'); await p.waitForTimeout(5000);
const wo=p.locator('text="Work Orders"').first(); const bb=await wo.boundingBox(); console.log('topmenu',JSON.stringify(bb)); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(6000); console.log('at',p.url());
const meas=()=>p.evaluate(()=>{const H=innerHeight;const v=[...document.querySelectorAll('td.cell.status .q-badge:not(.q-badge--floating)')].filter(b=>{const r=b.getBoundingClientRect();return r.top>0&&r.bottom<H}).map(b=>{const r=b.getBoundingClientRect();return {n:(b.closest('tr').innerText.match(/\b[A-Z0-9]{1,4}-\d{3,}\b/)||['?'])[0],t:b.innerText.trim(),w:+r.width.toFixed(2),x:+r.x.toFixed(1),y:+r.y.toFixed(1),h:+r.height.toFixed(1)}});const th=[...document.querySelectorAll('th')].find(t=>/^Status/.test(t.innerText.trim())).getBoundingClientRect();return {url:location.href,th:{x:th.x,w:th.width},v};});
const res={mk};
for(const tab of ['all','estimates','completed','work_orders']){ await p.click(`[data-test-id=tab_${tab}]`); await p.waitForTimeout(4000); res[tab]=await meas(); await p.screenshot({path:`/tmp/qa11310/pw-${tab}.png`}); const v=res[tab].v; console.log(tab,res[tab].url,v.length,[...new Set(v.map(x=>x.t))].join('|'),[...new Set(v.map(x=>x.w))]); }
await p.click('[data-test-id=tab_all]'); await p.waitForTimeout(3000);
await p.click('[data-test-id=page_search_toggle]'); await p.waitForTimeout(800); const inp=(await p.evaluateHandle(()=>document.activeElement)).asElement();
for(const n of ['S2-597','S2-691']){ await inp.fill(''); await inp.type(n,{delay:40}); await p.waitForTimeout(3500); res['search '+n]=await meas(); await p.screenshot({path:`/tmp/qa11310/pw-search-${n}.png`}); const v=res['search '+n].v; console.log(n,v.length,v.map(x=>x.t+':'+x.w).join(' ')); }
await inp.fill(''); await p.waitForTimeout(2000);
fs.writeFileSync('/tmp/qa11310/pwalk.json',JSON.stringify(res,null,1)); console.log(JSON.stringify(mk)); await s.close();
