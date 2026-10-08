import {ob,j} from './lib.mjs'; import {plaidLogin} from './plaid.mjs'; import fs from 'fs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const R={}; const log=[];
p.on('response',async r=>{try{const u=new URL(r.url()); if(/plaid\/exchange/.test(u.pathname)) log.push({st:r.status(),req:r.request().postData(),res:(await r.text()).slice(0,800)});}catch(e){}});
const sv=(k,v)=>{R[k]=v; fs.writeFileSync('Q.json',JSON.stringify({R,log},null,1)); console.log(k,j(v,700));};
const sbox=async tid=>{ await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.scrollIntoView({block:'center'}),tid); await p.waitForTimeout(400); return s.box(tid); };
const pickOpt=async(tid,label)=>{ const b=await sbox(tid); await p.mouse.click(b.x,b.y); await p.waitForTimeout(900); const o=await p.evaluate(l=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>x.innerText.includes(l)); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},label); await p.mouse.click(o.x,o.y); await p.waitForTimeout(800); };
await plaidLogin(s,{shot:'pl/Q'});
for(let i=0;i<20;i++){ if(i===4) continue; const b=await sbox(`checkbox_include_accounting_bank_connect_${i}`); if(!b) break; await p.mouse.click(b.x,b.y); await p.waitForTimeout(120); }
await pickOpt('select_gl_mode_accounting_bank_connect_4','Use an existing');
let b=await sbox('select_existing_accounting_bank_connect_4'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(900);
sv('Q1 Plaid picker options',await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.innerText.trim().replace(/\n+/g,' '))));
await p.screenshot({path:'Q-1-picker.png'});
await p.keyboard.press('Escape'); await p.waitForTimeout(500);
await pickOpt('select_existing_accounting_bank_connect_4','1091');
await sbox('select_existing_accounting_bank_connect_4'); await p.screenshot({path:'Q-2-picked.png'});
b=await sbox('button_submit_accounting_bank_connect'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(9000);
await p.screenshot({path:'Q-3-done.png'}); sv('Q3 page',(await p.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,500));
sv('Q4 banks',((await s.api('/api/accounting/bank-accounts?per_page=100')).json?.bank_accounts||[]).map(b=>[b.nickname||b.name,b.chart_account?.name||b.account_name,b.feed||b.source||b.connection_type]));
await s.close();
