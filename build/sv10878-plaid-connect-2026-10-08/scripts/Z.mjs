import {ob,j} from './lib.mjs'; import {plaidLogin} from './plaid.mjs'; import fs from 'fs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const R={}; const log=[];
const sv=(k,v)=>{R[k]=v; fs.writeFileSync('Z.json',JSON.stringify({R,log},null,1)); console.log(k,j(v,600));};
const sbox=async(pg,tid)=>pg.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); if(!e) return null; e.scrollIntoView({block:'center'}); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},tid);
const clickT=async(pg,tid)=>{ await sbox(pg,tid); await pg.waitForTimeout(400); const b=await sbox(pg,tid); await pg.mouse.click(b.x,b.y); };
const item=async(pg,label)=>{ const o=await pg.evaluate(l=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>x.innerText.includes(l)); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},label); await pg.mouse.click(o.x,o.y); await pg.waitForTimeout(800); };
const t2=await s.ctx.newPage(); await t2.setViewportSize({width:1600,height:1000});
t2.on('response',async r=>{ if(/bank-accounts\/sync/.test(r.url())) log.push({st:r.status(),res:(await r.text()).slice(0,300)}); });
const syncNow=async(tag)=>{ await t2.goto(s.host.app+'/accounting/banking/transactions',{waitUntil:'domcontentloaded'}); await t2.waitForTimeout(4500); const n=log.length; await clickT(t2,'button_sync_accounting_bank_transactions'); for(let i=0;i<20&&log.length===n;i++) await t2.waitForTimeout(300); await t2.waitForTimeout(900);
  const toast=await t2.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ')).join('|')); await t2.screenshot({path:`Z-sync-${tag}.png`}); return {response:log[log.length-1]?.res, toast}; };
sv('S0 sync before', await syncNow('0'));
// new active bank account to fight over
const mk=await t2.evaluate(async u=>{const r=await fetch(u,{method:'POST',credentials:'include',headers:{'content-type':'application/json',accept:'application/json'},body:JSON.stringify({account_number:'1094',name:'ZZAUTOTEST SV-10878 sync check',type:'asset',sub_type:'bank'})}); return r.status;}, s.host.api+'/api/accounting/accounts'); sv('create 1094',mk);
await plaidLogin(s,{shot:'pl/Z'});
for(let i=1;i<20;i++){ const b=await sbox(p,`checkbox_include_accounting_bank_connect_${i}`); if(!b) break; await p.waitForTimeout(80); const c=await sbox(p,`checkbox_include_accounting_bank_connect_${i}`); await p.mouse.click(c.x,c.y); await p.waitForTimeout(100); }
await clickT(p,'select_gl_mode_accounting_bank_connect_0'); await p.waitForTimeout(900); await item(p,'Use an existing');
await clickT(p,'select_existing_accounting_bank_connect_0'); await p.waitForTimeout(900); await item(p,'1094');
// link 1094 manually in tab 2
await t2.goto(s.host.app+'/accounting/banking/accounts',{waitUntil:'domcontentloaded'}); await t2.waitForTimeout(4000);
await clickT(t2,'button_new_accounting_bank_accounts'); await t2.waitForTimeout(1500);
await t2.fill('[data-test-id="input_nickname_accounting_bank_account"]','ZZAUTOTEST SV-10878 sync manual'); await t2.fill('[data-test-id="input_institution_accounting_bank_account"]','ZZ Test Bank'); await t2.fill('[data-test-id="input_mask_accounting_bank_account"]','7777');
await clickT(t2,'select_gl_account_accounting_bank_account'); await t2.waitForTimeout(1000); await item(t2,'1094');
await clickT(t2,'button_save_accounting_bank_account'); await t2.waitForTimeout(3000);
sv('manual link 1094',await t2.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText).join('|')));
// refused connect
await clickT(p,'button_submit_accounting_bank_connect'); await p.waitForTimeout(7000); await sbox(p,'select_existing_accounting_bank_connect_0'); await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(500);
await p.screenshot({path:'Z-refused.png'}); sv('refused page',(await p.evaluate(()=>[...document.querySelectorAll('.text-negative,.q-field__messages,[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '))));
sv('S1 sync after refused', await syncNow('1'));
// fix and connect
await clickT(p,'select_gl_mode_accounting_bank_connect_0'); await p.waitForTimeout(900); await item(p,'Create a chart account automatically');
await clickT(p,'button_submit_accounting_bank_connect'); await p.waitForTimeout(9000); await p.screenshot({path:'Z-connected.png'});
sv('connected page',(await p.evaluate(()=>document.body.innerText)).match(/Connected[^\n]*/)?.[0]);
sv('S2 sync after success', await syncNow('2'));
await s.close();
