import {prod1} from '../common.mjs'; const WO=process.argv[2]; const s=await prod1('/tmp/qa75'); const p=s.page;
const ids=()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+':'+e.innerText.trim().slice(0,22).replace(/\n/g,' ')).filter(x=>/portal|approval|send/i.test(x)));
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(6000); for(let i=0;i<2;i++){ const x=p.locator('.q-dialog [data-test-id="button_close_dialog"]').first(); if(await x.count()){await x.click(); await p.waitForTimeout(700);} }
const cb=await p.evaluate(()=>{const e=document.querySelector('tbody tr .q-checkbox, tbody tr [role=checkbox]'); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};}); if(cb){ await p.mouse.click(cb.x,cb.y); await p.waitForTimeout(1500); } console.log('LINES after tick',(await ids()).join(' | '));
console.log('TEXT',(await p.evaluate(()=>document.body.innerText.match(/Send[^\n]{0,30}|Portal[^\n]{0,30}/g)))?.slice(0,10));
await p.screenshot({path:'sv11662/00b-lines-ticked.png'});
await s.go(`/workorders/${WO}/finance`); await p.waitForTimeout(6000); console.log('FIN url',p.url(),(await ids()).join(' | ')); console.log('FINTEXT',(await p.evaluate(()=>document.body.innerText.match(/contact[^\n]{0,60}/gi)))?.slice(0,4)); await p.screenshot({path:'sv11662/00c-finance.png'});
await s.close(); process.exit(0);
