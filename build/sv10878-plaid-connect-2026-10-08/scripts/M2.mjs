import {ob,j} from './lib.mjs'; import {plaidLogin} from './plaid.mjs'; import fs from 'fs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const R={}; const log=[];
p.on('response',async r=>{try{const u=new URL(r.url()); if(/sv10360api/.test(u.host)&&/bank|plaid/.test(u.pathname)&&r.request().method()!=='GET') log.push({m:r.request().method(),st:r.status(),path:u.pathname,req:r.request().postData(),res:(await r.text()).slice(0,2500)});}catch(e){}});
const sv=(k,v)=>{R[k]=v; fs.writeFileSync('M2.json',JSON.stringify({R,log},null,1)); console.log(k,j(v,900));};
const sbox=async tid=>{ await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.scrollIntoView({block:'center'}),tid); await p.waitForTimeout(400); return s.box(tid); };
const pickOpt=async(tid,label)=>{ const b=await sbox(tid); await p.mouse.click(b.x,b.y); await p.waitForTimeout(900); const o=await p.evaluate(l=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>x.innerText.includes(l)); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},label); if(!o){ await p.keyboard.press('Escape'); throw new Error('no option '+label+' in '+tid);} await p.mouse.click(o.x,o.y); await p.waitForTimeout(800); };
const list=async (tid,shot)=>{ const b=await sbox(tid); await p.mouse.click(b.x,b.y); await p.waitForTimeout(900); const o=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.innerText.trim().replace(/\n+/g,' '))); if(shot) await p.screenshot({path:`M2-${shot}.png`}); await p.keyboard.press('Escape'); await p.waitForTimeout(500); return o; };
const rows=async()=>p.evaluate(()=>[0,1].map(i=>{const r=document.querySelector(`[data-test-id="row_account_accounting_bank_connect_${i}"]`); return r? r.innerText.replace(/\n+/g,' | '):null;}));
const banks=async()=>((await s.api('/api/accounting/bank-accounts?per_page=100')).json?.bank_accounts||[]).map(b=>[b.nickname||b.name,b.chart_account?.name||b.account_name||b.account_id,b.feed||b.source||b.connection_type]);
await plaidLogin(s,{shot:'pl/M2'});
for(let i=2;i<20;i++){ const b=await sbox(`checkbox_include_accounting_bank_connect_${i}`); if(!b) break; await p.mouse.click(b.x,b.y); await p.waitForTimeout(120); }
await pickOpt('select_gl_mode_accounting_bank_connect_0','Use an existing');
sv('E1 Plaid picker options after Checking was linked manually',await list('select_existing_accounting_bank_connect_0','E1'));
await pickOpt('select_existing_accounting_bank_connect_0','Savings Account');
// tab2 manual add on Savings
const t2=await s.ctx.newPage(); await t2.goto(s.host.app+'/accounting/banking/accounts',{waitUntil:'domcontentloaded'}); await t2.waitForTimeout(3500);
const bx=async tid=>t2.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},tid);
let c=await bx('button_new_accounting_bank_accounts'); await t2.mouse.click(c.x,c.y); await t2.waitForTimeout(1500);
await t2.fill('[data-test-id="input_nickname_accounting_bank_account"]','ZZAUTOTEST SV-10878 manual savings'); await t2.fill('[data-test-id="input_institution_accounting_bank_account"]','ZZ Test Bank'); await t2.fill('[data-test-id="input_mask_accounting_bank_account"]','8888');
c=await bx('select_gl_account_accounting_bank_account'); await t2.mouse.click(c.x,c.y); await t2.waitForTimeout(1000);
sv('E2 manual form options',await t2.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.innerText.trim().replace(/\n+/g,' '))));
const ck=await t2.evaluate(()=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>x.innerText.includes('Savings Account')); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};}); await t2.mouse.click(ck.x,ck.y); await t2.waitForTimeout(700);
c=await bx('button_save_accounting_bank_account'); await t2.mouse.click(c.x,c.y); await t2.waitForTimeout(3000);
sv('E3 manual add notif',await t2.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText).join('|'))); await t2.close();
sv('E4 banks before connect',await banks());
await p.bringToFront();
let b=await sbox('button_submit_accounting_bank_connect'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(6000);
sv('F1 rows after connect',await rows()); sv('F1 notif',await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText).join('|')));
await p.evaluate(()=>document.querySelector('[data-test-id="row_account_accounting_bank_connect_0"]')?.scrollIntoView({block:'center'})); await p.waitForTimeout(500); await p.screenshot({path:'M2-F1.png'});
sv('F2 banks after refused connect',await banks());
fs.writeFileSync('M2-state.txt','F done');
// fix row0 -> create automatically, connect again
await pickOpt('select_gl_mode_accounting_bank_connect_0','Create a chart account automatically');
sv('G0 rows after fix',await rows());
b=await sbox('button_submit_accounting_bank_connect'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(8000);
sv('G1 page',(await p.evaluate(()=>document.querySelector('.q-page')?.innerText||'')).replace(/\n+/g,' | ').slice(0,700)); sv('G1 url',p.url());
await p.screenshot({path:'M2-G1.png'});
sv('G2 banks after successful connect',await banks());
await s.close();
