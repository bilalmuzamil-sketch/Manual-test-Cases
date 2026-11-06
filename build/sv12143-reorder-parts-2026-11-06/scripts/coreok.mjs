// click the core row's "Ok" button (Core OK), follow any confirms, print requests and the core row after reload
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'prod'; const S=JSON.parse(fs.readFileSync(`/tmp/sv12143-${ENV}.json`,'utf8')); const s=await sess(); const p=s.page; const caps=[];
p.on('response',async r=>{ if(r.request().method()!=='GET'&&/\/api\//.test(r.url())&&!/recent-entities|6364962/.test(r.url())){ let b='';try{b=(await r.text()).slice(0,250)}catch{} caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' :: '+(r.request().postData()||'').slice(0,250)+' -> '+b);} });
await s.go('/workorders/'+S.id+'/lines'); await p.waitForTimeout(8000);
const row=p.locator('tr',{hasText:'Core for'}).filter({hasText:process.env.CORE||'Core for'}).first(); await p.screenshot({path:`../ev/${ENV}-coreok-before.png`});
await row.locator('button',{hasText:process.env.BTN==='not'?/Not Ok/:/^\s*Ok\s*$/}).first().click(); await p.waitForTimeout(2500);
for(let i=0;i<3;i++){ const d=await p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?{t:d.innerText.replace(/\s+/g,' ').slice(0,300),b:[...d.querySelectorAll('button')].map(b=>b.innerText.trim()+'['+b.getAttribute('data-test-id')+']')}:null}); console.log('dialog',JSON.stringify(d)); if(!d) break;
 const b=p.locator('.q-dialog button').filter({hasText:/yes|confirm|ok|are you sure|save|submit|return/i}).last(); if(!(await b.count())) break; await b.click(); await p.waitForTimeout(2500); }
await p.screenshot({path:`../ev/${ENV}-coreok-after.png`}); await p.reload(); await p.waitForTimeout(8000);
console.log('core row',await p.locator('tr',{hasText:'Core for'}).filter({hasText:process.env.CORE||'Core for'}).first().innerText().then(t=>t.replace(/\s+/g,' ')));
console.log('caps',JSON.stringify(caps,null,1)); await s.close(); process.exit(0);
