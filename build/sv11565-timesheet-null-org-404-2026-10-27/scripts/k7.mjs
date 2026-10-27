import {sess} from './lib.mjs';
const s=await sess(); const P=s.page; const log=[];
P.on('request',q=>{if(/technician-tasks/.test(q.url())&&q.method()==='POST')log.push('REQ '+q.url().split('/api')[1]+' '+q.postData())});
P.on('response',async r=>{if(/technician-tasks/.test(r.url())&&r.request().method()==='POST')log.push('RES '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,200))});
await s.go('/reports/punch-clock-activities'); await P.waitForTimeout(3500);
console.log(await P.evaluate(()=>[...document.querySelectorAll('header [data-test-id], .q-header [data-test-id]')].map(e=>e.dataset.testId+':'+e.innerText.trim().slice(0,30)).join(' | ')));
await P.screenshot({path:'../ev/k7-header-clocked-in.png',clip:{x:1150,y:0,width:450,height:60}}); {const b=await s.box('clock_in_button'); await P.mouse.click(b.x,b.y);} await P.waitForTimeout(2000);
const vis=await P.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id], .q-dialog [data-test-id]')].map(e=>e.dataset.testId+':'+e.innerText.trim().slice(0,30))); console.log('opened',vis.join(' | '));
await P.screenshot({path:'../ev/k7-clock-menu.png'});
const co=vis.find(v=>/clock.?out/i.test(v)); if(co){const t=co.split(':')[0]; const b=await s.box(t); await P.mouse.click(b.x,b.y); await P.waitForTimeout(2000);
 const d=await P.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.dataset.testId+':'+e.innerText.trim().slice(0,30))); console.log('dialog',d.join(' | '));
 const ta=P.locator('.q-dialog textarea, .q-dialog input[type=text]').first(); if(await ta.count()) await ta.fill('ZZAUTOTEST SV-11565 clock-in check');
 const ok=d.find(v=>/clock.?out|confirm|save|submit/i.test(v)&&!/cancel/i.test(v)); if(ok){const b2=await s.box(ok.split(':')[0]); await P.mouse.click(b2.x,b2.y); await P.waitForTimeout(3000);} }
console.log(log.join('\n'));
await s.browser.close(); process.exit(0);
