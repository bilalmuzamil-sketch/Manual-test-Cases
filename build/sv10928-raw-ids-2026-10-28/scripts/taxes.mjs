// Taxes, two tabs: create a tax with two rates; open it in tab A and tab B; remove a rate in B and save; then save in A.
// usage: node taxes.mjs <branch|prod>
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const out=`/tmp/s10928/${env}-taxes`; fs.mkdirSync(out,{recursive:true});
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'10928',cookies,dir:(process.env.QA_DIR||'/tmp/qa24'),user:'bilal.muzamil@shopview.com'}); const A=s.page; const R={env};
const tid=(pg,t)=>pg.locator(`[data-test-id="${t}"]`).first();
const fillIn=async(pg,t,v)=>{ const l=pg.locator(`[data-test-id="${t}"] input, input[data-test-id="${t}"]`).first(); await l.click(); await l.fill(v); };
const name='ZZAUTOTEST T10928 '+env+' '+new Date().toISOString().slice(11,19).replace(/:/g,'');
await s.go('/administration/taxes'); await A.waitForTimeout(3000);
await tid(A,'button_new_tax').click(); await A.waitForTimeout(1500);
await fillIn(A,'input_tax_name',name); await fillIn(A,'input_rate_name_0','ZZ Rate One'); await fillIn(A,'input_rate_percentage_0','1');
await tid(A,'button_add_rate').click(); await A.waitForTimeout(600);
await fillIn(A,'input_rate_name_1','ZZ Rate Two'); await fillIn(A,'input_rate_percentage_1','2');
await tid(A,'button_save_tax').click(); await A.waitForTimeout(3000); R.name=name;
const openTax=async(pg)=>{ await pg.goto(s.host.app+'/administration/taxes',{waitUntil:'domcontentloaded'}); await pg.waitForTimeout(4000);
  const row=pg.locator('tr',{hasText:name}).first(); await row.scrollIntoViewIfNeeded(); await row.click(); await pg.waitForTimeout(2500);
  return pg.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id'))); };
R.tidsA=await openTax(A); console.log('A dialog',R.tidsA.join(' '));
const B=await s.ctx.newPage(); R.tidsB=await openTax(B);
await B.screenshot({path:out+'/B-open.png'});
// remove the second rate in tab B
const rm=R.tidsB.find(t=>/remove|delete/i.test(t)&&/1$/.test(t))||R.tidsB.filter(t=>/remove_rate|delete_rate/i.test(t)).pop();
R.rm=rm; console.log('remove control',rm);
if(rm){ await tid(B,rm).click(); await B.waitForTimeout(1000); await B.screenshot({path:out+'/B-after-remove.png'});
  R.afterRemove=await B.evaluate(()=>({dialogs:[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,200)), save:document.querySelector('[data-test-id="button_save_tax"]')?.getAttribute('aria-disabled')})); console.log('after remove',JSON.stringify(R.afterRemove)); }
const caps=[]; const watch=pg=>pg.on('response',async r=>{ if(r.request().method()!=='GET'&&/shopview\.com\/api\//.test(r.url())) caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' :: '+(await r.text().catch(()=>'')).slice(0,300)); });
watch(A); watch(B);
await tid(B,'button_save_tax').click(); await B.waitForTimeout(3000); await B.screenshot({path:out+'/B-saved.png'});
// tab A still has the old two rates: make a small change so Save is enabled, then save
await fillIn(A,'input_rate_percentage_0','1.5'); await A.waitForTimeout(500);
await tid(A,'button_save_tax').click(); await A.waitForTimeout(400);
const toasts=[]; for(let i=0;i<16;i++){ for(const t of await A.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim()))) if(!toasts.includes(t)) toasts.push(t); if(toasts.length&&i>3) break; await A.waitForTimeout(250); }
await A.screenshot({path:out+'/A-save-error.png'}); R.toasts=toasts; R.requests=caps;
console.log(JSON.stringify(R,null,1).slice(0,2500)); fs.writeFileSync(out+'/result.json',JSON.stringify(R,null,1)); await s.close();
