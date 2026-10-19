// explore: Schedule cell menu -> New Work Order for Owen Created QA1019
import {session} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:1}); const p=s.page; const out={};
const reqs=[]; p.on('request',r=>{ if(r.method()!=='GET'&&/work-orders|schedule|shift/.test(r.url())) reqs.push({m:r.method(),u:r.url().replace(/^https:\/\/[^/]+/,''),b:(r.postData()||'').slice(0,400)}); });
await s.go('/schedule'); await p.waitForTimeout(6000);
const row=await p.evaluateHandle(()=>{const el=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&/Owen Created QA1019/.test(e.textContent)); if(el) el.scrollIntoView({block:'center'}); return el;});
await p.waitForTimeout(1500); const rb=await row.asElement()?.boundingBox(); out.row=rb;
await p.screenshot({path:'/tmp/qa11310/ex26/sch0.png'});
if(rb){ await p.mouse.click(rb.x+600,rb.y+rb.height/2); await p.waitForTimeout(1500);
  out.menu=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item, .q-menu button')].map(e=>(e.dataset.testId||'')+':'+e.innerText.trim()).slice(0,20));
  await p.screenshot({path:'/tmp/qa11310/ex26/sch1.png'}); }
out.reqs=reqs; fs.writeFileSync('/tmp/qa11310/ex26/k11b.json',JSON.stringify(out,null,1)); console.log(JSON.stringify(out).slice(0,1500)); await s.close();
