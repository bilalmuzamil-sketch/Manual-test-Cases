import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:1,vp:{width:1600,height:1000}}); const p=s.page; const R=JSON.parse(fs.readFileSync('ids.json')); const reqs=[];
p.on('request',r=>{ if(/import/.test(r.url())&&r.method()!=='GET') reqs.push(r.method()+' '+r.url()+' ct='+(r.headers()['content-type']||'')); });
p.on('response',async r=>{ if(/import/.test(r.url())&&r.request().method()!=='GET') reqs.push('<- '+r.status()+' '+(await r.text().catch(()=>'')).slice(0,300)); });
await p.goto(s.host.app+'/accounting/banking/transactions',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(5000);
const menu='button_card_menu_accounting_bank_transactions_'+R.bank; let b=await s.box(menu); console.log('menu box',!!b);
if(!b){ console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="button_card_menu"]')].map(e=>e.getAttribute('data-test-id')).join(','))); }
await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.scrollIntoView({block:'center',inline:'center'}),menu); await p.waitForTimeout(500); b=await s.box(menu); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1000);
console.log('menu items',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim()+'|'+(e.getAttribute('data-test-id')||'')))));
const it=await p.evaluate(()=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>/import/i.test(x.innerText)); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};});
if(it){ await p.mouse.click(it.x,it.y); await p.waitForTimeout(3000); console.log('url',p.url()); console.log('inputs',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('input,[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0||e.type==='file').map(e=>(e.getAttribute('data-test-id')||e.type)+':'+(e.innerText||e.placeholder||'').slice(0,30)).slice(0,40))));
 await p.setInputFiles('input[type=file]','rows.csv'); await p.waitForTimeout(800);
 const ib=await p.evaluate(()=>{const e=[...document.querySelectorAll('.q-dialog button')].find(x=>x.innerText.trim()==='Import'); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};}); await p.mouse.click(ib.x,ib.y); await p.waitForTimeout(5000);
 console.log(reqs.join('\n')); console.log('notif',await p.evaluate(()=>[...document.querySelectorAll('.q-notification,.q-banner,[role=alert]')].map(n=>n.innerText).join('|')));
 const t=await s.api('/api/accounting/bank-transactions?account_id='+R.chart+'&per_page=20'); const rows=t.json.bank_transactions||[]; R.rows=Object.fromEntries(rows.map(x=>[x.description.replace(/^ZZ10902-(\w).*/,'$1'),x.id]));
 console.log(rows.length, JSON.stringify(rows[0]||{}).slice(0,1500)); fs.writeFileSync('ids.json',JSON.stringify(R,null,1)); }
await s.close();
