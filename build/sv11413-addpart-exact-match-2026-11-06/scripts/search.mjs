// open WO lines, click "+ Add Part" on line 1, type Q into the part search, list the options in order (+ the search request)
import {sess} from './common.mjs'; import fs from 'fs'; const E=process.env.ENV||'branch'; const W=JSON.parse(fs.readFileSync(`/tmp/sv11413-${E}-wo.json`,'utf8'));
const s=await sess(); const p=s.page; const reqs=[];
p.on('request',r=>{ if(/parts|catalog|search/i.test(r.url())&&r.method()==='GET'&&/\/api\//.test(r.url())) reqs.push(r.url().replace(/^https:\/\/[^/]+/,'').slice(0,220)); });
await s.go('/workorders/'+W.id+'/lines'); await p.waitForTimeout(8000);
await p.click('[data-test-id="button_add_part"]'); await p.waitForTimeout(3000);
const dlg=await p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?[...d.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).slice(0,25):null}); console.log('dialog ids',JSON.stringify(dlg));
const sel=p.locator('[data-test-id="select_inline_part_number"]').first(); console.log('select_part',await sel.count()); await sel.click(); await p.waitForTimeout(1500);
if(process.env.Q!==undefined){ await p.keyboard.type(process.env.Q,{delay:80}); await p.waitForTimeout(4000); }
const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,90)));
console.log('options',opts.length); opts.slice(0,+(process.env.N||25)).forEach((o,i)=>console.log(String(i+1).padStart(2),o));
await p.screenshot({path:`../ev/${E}-search-${process.env.TAG||process.env.Q||'empty'}.png`}); console.log('reqs',JSON.stringify(reqs.slice(-3))); await s.close(); process.exit(0);
