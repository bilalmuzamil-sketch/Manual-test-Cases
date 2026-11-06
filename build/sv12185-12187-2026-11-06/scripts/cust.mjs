// node cust.mjs -> SV-12185 matrix on the screen: duplicate-name create, valid create, duplicate-name edit, valid edit. Records every toast after Save (text, red?, ms after click) + screenshot. Writes ../ev/<env>-cust.json
import {sess} from './common.mjs'; import fs from 'fs';
const E=process.env.ENV==='prod'?'prod':'branch'; const s=await sess(); const p=s.page; const R={build:null,rows:[]};
const toasts=async()=>p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>({text:n.innerText.replace(/\s+/g,' ').trim(),cls:n.className})));
const reqs=[]; p.on('response',r=>{ if(/\/api\/customers?\/|\/api\/companies/.test(r.url()) && r.request().method()!=='GET') reqs.push(r.request().method()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' -> '+r.status()); });
async function watch(label){ const seen=new Map(); const t0=Date.now(); let shot=false; while(Date.now()-t0<3500){ const ts=await toasts(); for(const t of ts){ if(!seen.has(t.text)) seen.set(t.text,{text:t.text,red:/negative|bg-red|red/.test(t.cls),ms:Date.now()-t0}); } if(!shot && ts.length && Date.now()-t0>600){ await p.screenshot({path:`../ev/${E}-${label}.png`}); shot=true;} await p.waitForTimeout(80);} if(!shot) await p.screenshot({path:`../ev/${E}-${label}.png`}); return [...seen.values()]; }
async function closeDlg(){ await s.go(CUR); await p.waitForTimeout(2500); return; for(let i=0;i<4 && await p.locator('.q-dialog').count();i++){ await p.locator('[data-test-id=button_close_dialog]').first().click({force:true,timeout:2000}).catch(()=>p.keyboard.press('Escape')); await p.waitForTimeout(900);} }
async function clearToasts(){ await p.evaluate(()=>document.querySelectorAll('.q-notification').forEach(n=>n.remove())); }
R.build=await p.evaluate(()=>document.querySelector('meta[name=app-version]')?.content);
await s.go('/customers'); await p.waitForTimeout(3000);
const list=(await s.api('/api/customers?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=5')).json.data.collection; const existing=list[0].name; const second=list[1];
let CUR='/customers';
async function create(label,name){ await clearToasts(); reqs.length=0; await p.click('[data-test-id=button_new_customer]'); await p.waitForTimeout(1500);
  await p.fill('[data-test-id=input_customer_name]',name); await p.waitForTimeout(300); await p.click('[data-test-id=button_save_customer]'); const t=await watch(label);
  const open=await p.locator('.q-dialog [data-test-id=input_customer_name]').count(); R.rows.push({label,name,toasts:t,dialogStillOpen:open>0,requests:[...reqs]}); console.log(label,JSON.stringify(t),'dialogOpen',open>0,reqs.join(' | '));
  await closeDlg(); }
if(!process.env.EDITONLY){ await create('1-dup-create',existing);
await create('2-dup-create-case',existing.toUpperCase());
await create('3-valid-create','ZZAUTOTEST SV12185 '+String(Date.now()).slice(-5)); }
// edit path: open the 2nd customer, find an edit control
CUR='/customers/'+second.id; await s.go(CUR); await p.waitForTimeout(3500);
const ids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(x=>/edit/i.test(x)));
console.log('edit ids',ids.join(','));
const ed=ids.find(x=>/edit_customer|customer_edit|edit_company/.test(x))||'button_base';
async function edit(label,name){ await clearToasts(); reqs.length=0; await p.click(`[data-test-id=${ed}]`); await p.waitForTimeout(+(process.env.WAIT||4000)); await p.fill("[data-test-id=input_customer_name]",name); await p.waitForTimeout(500); console.log(label,'save state',await p.evaluate(()=>{const b=document.querySelector('[data-test-id=button_save_customer]'); return b&&(b.disabled+' '+b.className+' '+getComputedStyle(b).opacity)}), 'errors:',await p.evaluate(()=>[...document.querySelectorAll('.q-field--error .q-field__messages')].map(x=>x.innerText).join('|'))); await p.click('[data-test-id=button_save_customer]'); const t=await watch(label);
  const open=await p.locator('.q-dialog [data-test-id=input_customer_name]').count(); R.rows.push({label,name,toasts:t,dialogStillOpen:open>0,requests:[...reqs]}); console.log(label,JSON.stringify(t),'dialogOpen',open>0,reqs.join(' | '));
  await closeDlg(); }
if(ed){ await edit('4-dup-edit',existing); await edit('5-valid-edit',second.name); }
fs.writeFileSync(`../ev/${E}-cust${process.env.EDITONLY?'-edit':''}.json`,JSON.stringify(R,null,1)); await s.close(); process.exit(0);
