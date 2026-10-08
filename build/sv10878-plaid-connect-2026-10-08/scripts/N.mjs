import {ob,j} from './lib.mjs'; import {plaidLogin} from './plaid.mjs'; import fs from 'fs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const R={}; const log=[];
p.on('response',async r=>{try{const u=new URL(r.url()); if(/sv10360api/.test(u.host)&&/plaid\/exchange/.test(u.pathname)) log.push({m:r.request().method(),st:r.status(),req:r.request().postData(),res:(await r.text()).slice(0,1500)});}catch(e){}});
const sv=(k,v)=>{R[k]=v; fs.writeFileSync('N.json',JSON.stringify({R,log},null,1)); console.log(k,j(v,900));};
const sbox=async tid=>{ await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.scrollIntoView({block:'center'}),tid); await p.waitForTimeout(400); return s.box(tid); };
const pickOpt=async(tid,label)=>{ const b=await sbox(tid); await p.mouse.click(b.x,b.y); await p.waitForTimeout(900); const o=await p.evaluate(l=>{const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>x.innerText.includes(l)); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},label); if(!o){ await p.keyboard.press('Escape'); throw new Error('no option '+label);} await p.mouse.click(o.x,o.y); await p.waitForTimeout(800); };
const list=async (tid,shot)=>{ const b=await sbox(tid); await p.mouse.click(b.x,b.y); await p.waitForTimeout(900); const o=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.innerText.trim().replace(/\n+/g,' '))); if(shot) await p.screenshot({path:`N-${shot}.png`}); await p.keyboard.press('Escape'); await p.waitForTimeout(500); return o; };
const banks=async()=>((await s.api('/api/accounting/bank-accounts?per_page=100')).json?.bank_accounts||[]).map(b=>[b.nickname||b.name,b.chart_account?.name||b.account_name||b.account_id,b.feed||b.source||b.connection_type]);
const ID={c1000:'01a1107a-df12-735d-a2db-fb209dd2f8fc',c2300:'01a1107a-df3a-70f0-8f23-a940d3d06b8e',c6000:'01a1107a-df59-7379-88d9-f25ebaf5929d',c1090:'01a11a87-e2d1-7090-b9e0-6a026dcfc40a'};
await plaidLogin(s,{shot:'pl/N'});
// keep row 0 (Plaid Checking) and row 3 (Plaid Credit Card)
for(let i=1;i<20;i++){ if(i===3) continue; const b=await sbox(`checkbox_include_accounting_bank_connect_${i}`); if(!b) break; await p.mouse.click(b.x,b.y); await p.waitForTimeout(120); }
await pickOpt('select_gl_mode_accounting_bank_connect_3','Use an existing');
sv('H1 Plaid picker options now',await list('select_existing_accounting_bank_connect_3','H1'));
await pickOpt('select_existing_accounting_bank_connect_3','2300 Credit Card Payable');
await p.screenshot({path:'N-H1b.png'});
// capture token: intercept first exchange
let body=null; await p.route('**/plaid/exchange',async route=>{ body=route.request().postData(); await route.abort(); });
let b=await sbox('button_submit_accounting_bank_connect'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(3000); await p.unroute('**/plaid/exchange');
await p.waitForTimeout(2000); const q=await s.ctx.newPage(); await q.goto(s.host.app+'/accounting/banking/connect').catch(()=>{}); await q.waitForTimeout(4000);
const api=async(path,o={})=>q.evaluate(async([u,o])=>{const r=await fetch(u,{credentials:'include',...o,headers:{accept:'application/json',...(o.headers||{})}}); const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {status:r.status,json:j,text:t.slice(0,800)};},[s.host.api+path,o]);
s.api=api;
const B=JSON.parse(body); sv('H2 captured selections',B.selections);
const pa=B.selections.map(x=>x.plaid_account_id); const tok=B.public_token;
const ex=async (name,sel)=>{ const r=await s.api('/api/accounting/banking/plaid/exchange',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({public_token:tok,start_date:B.start_date,selections:sel})}); sv('API '+name,{status:r.status,body:r.json??r.text}); };
await ex('duplicate account',[{plaid_account_id:pa[0],account_id:ID.c2300},{plaid_account_id:pa[1],account_id:ID.c2300}]);
await ex('non-bank account (6000 Wages)',[{plaid_account_id:pa[0],account_id:ID.c6000}]);
await ex('inactive bank account (1090)',[{plaid_account_id:pa[0],account_id:ID.c1090}]);
await ex('already linked (1000)',[{plaid_account_id:pa[0],account_id:ID.c1000}]);
await ex('both account_id and new number',[{plaid_account_id:pa[0],account_id:ID.c2300,new_account_number:'1095',new_account_name:'ZZ both'}]);
await ex('taken new number (1000)',[{plaid_account_id:pa[0],account_id:null,new_account_number:'1000',new_account_name:'ZZ taken'}]);
await ex('same new number twice',[{plaid_account_id:pa[0],account_id:null,new_account_number:'1096',new_account_name:'ZZ a'},{plaid_account_id:pa[1],account_id:null,new_account_number:'1096',new_account_name:'ZZ b'}]);
sv('I0 banks after all refusals',await banks());
// real connect through the UI: row 3 -> 2300, row 0 automatic
await ex('REAL credit card -> 2300',[{plaid_account_id:B.selections.find(x=>x.account_id===ID.c2300).plaid_account_id,account_id:ID.c2300}]);
sv('J2 banks after real connect',await banks());
await s.close();
