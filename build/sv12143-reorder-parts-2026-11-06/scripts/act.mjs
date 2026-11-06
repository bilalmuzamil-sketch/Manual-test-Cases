// click the part action button on row NAME (e.g. Pick), follow confirms; print the menu/dialog and requests; then list the rows
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const S=JSON.parse(fs.readFileSync(`/tmp/sv12143-${ENV}.json`,'utf8')); const s=await sess(); const p=s.page; const caps=[];
p.on('response',async r=>{ if(r.request().method()!=='GET'&&/\/api\/(?!6364962)/.test(r.url())){ let b='';try{b=(await r.text()).slice(0,200)}catch{} caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' :: '+(r.request().postData()||'').slice(0,200)+' -> '+b);} });
await s.go('/workorders/'+S.id+'/lines'); await p.waitForTimeout(8000);
const row=p.locator('tr',{has:p.locator('[data-test-id^="part_number_"]',{hasText:process.env.NAME})}).first();
const btn=row.locator(process.env.SEL||'[data-test-id="button_part_request_action"]').first(); console.log('btn text',(await btn.innerText()).replace(/\s+/g,' ')); await btn.click(); await p.waitForTimeout(2500);
const dl=()=>p.evaluate(()=>{const d=document.querySelector('.q-dialog,.q-menu'); return d?{t:d.innerText.replace(/\n+/g,' | ').slice(0,400),ids:[...d.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).slice(0,20)}:null;});
console.log('popup',JSON.stringify(await dl()));
if(process.env.CLICK){ for(const t of process.env.CLICK.split('|')){ const b=p.locator('.q-dialog button, .q-menu .q-item, .q-dialog .q-item').filter({hasText:new RegExp(t,'i')}).last(); if(await b.count()){ await b.click(); await p.waitForTimeout(2500); console.log('clicked',t,JSON.stringify(await dl())); } } }
await p.waitForTimeout(2000); await p.reload(); await p.waitForTimeout(8000);
console.log('rows',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="part_number_"]')].map(e=>e.innerText.split('\n').filter(x=>x&&!/drag_indicator|edit|more_vert/.test(x)).join(' ')))));
console.log('caps',JSON.stringify(caps.filter(c=>!/recent-entities/.test(c))).slice(0,1500)); await p.screenshot({path:`../ev/${ENV}-act-${process.env.TAG||'x'}.png`}); await s.close(); process.exit(0);
