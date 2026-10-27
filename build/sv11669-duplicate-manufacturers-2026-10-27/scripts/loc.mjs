import {sess2} from './lib2.mjs'; const s=await sess2(); const P=s.page; const log=[];
P.on('response',async r=>{const u=r.url(); if(/\/api\//.test(u)&&r.request().method()!=='GET'&&!/envelope|touch/.test(u)) log.push('RES '+r.status()+' '+u.split('/api')[1]+' '+(await r.text().catch(()=>'')).slice(0,200));});
P.on('request',q=>{const u=q.url(); if(/\/api\//.test(u)&&q.method()!=='GET'&&!/envelope|touch/.test(u)) log.push('REQ '+u.split('/api')[1]+' '+q.postData());});
await s.go('/administration/locations'); await P.waitForTimeout(3000);
console.log(await P.evaluate(()=>document.querySelector('.q-page')?.innerText.replace(/\n+/g,' | ').slice(0,300)));
console.log(await P.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.dataset.testId).filter(t=>!/nav|module|clock|notif|profile|search|skip|night/.test(t)).join(' | ')));
const nb=await P.evaluate(()=>{const e=[...document.querySelectorAll('button')].find(b=>/new|add|create/i.test(b.innerText)&&b.offsetParent); if(!e)return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText.trim(),id:e.dataset.testId};});
console.log('button',JSON.stringify(nb)); if(nb){await P.mouse.click(nb.x,nb.y); await P.waitForTimeout(1800); console.log('dialog',await P.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.dataset.testId+'«'+(e.innerText||'').trim().slice(0,20).replace(/\n/g,' ')+'»').join(' | ')));}
await P.screenshot({path:'../ev/loc-dialog.png'}); await s.browser.close(); process.exit(0);
