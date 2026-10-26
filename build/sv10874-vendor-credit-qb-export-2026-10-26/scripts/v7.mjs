import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import {netlog} from './lib.mjs'; import fs from 'fs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2});
const A=s.page; const log=[]; netlog(A,log); const V='f9618e14-2255-470d-afc7-b20c8e7fc33d';
await s.go(`/parts/vendor/${V}/unpaid-invoices`); await A.waitForTimeout(6000);
await A.click('[data-test-id="button_new_credit_vendor"]'); await A.waitForTimeout(1500);
console.log('dlg',JSON.stringify(await A.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')))));
await A.locator('.q-dialog [data-test-id="input_credit_amount"]').locator('input').first().fill('12.34').catch(async()=>{await A.locator('.q-dialog input[data-test-id="input_credit_amount"]').fill('12.34')});
await A.locator('.q-dialog [data-test-id="input_credit_memo"]').locator('input,textarea').first().fill('ZZAUTOTEST SV-10874 manual credit').catch(async()=>{await A.locator('.q-dialog [data-test-id="input_credit_memo"]').fill('ZZAUTOTEST SV-10874 manual credit')});
await A.screenshot({path:'v7-new-credit.png'});
const btn=await A.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].map(b=>(b.getAttribute('data-test-id')||'')+'='+b.innerText.trim()));
console.log('buttons',JSON.stringify(btn));
const save=A.locator('.q-dialog button').filter({hasText:/save|create|submit|add/i}).last(); await save.click(); await A.waitForTimeout(4000);
console.log(log.filter(x=>!/my-tasks|preferences/.test(x)).join('\n'));
await s.go(`/parts/vendor/${V}/unpaid-invoices`); await A.waitForTimeout(6000);
const r=await A.evaluate(()=>{const row=[...document.querySelectorAll('[data-test-id="table-unpaid-transactions"] tr')].find(r=>/12\.34/.test(r.innerText)); if(!row) return null; const a=row.querySelector('a[href]'); const rb=row.getBoundingClientRect(); return {t:row.innerText.replace(/\s+/g,' '),href:a?a.getAttribute('href'):null,row:[rb.x,rb.y,rb.width,rb.height],noCell:(()=>{const c=row.querySelectorAll('td')[3];const b=c.getBoundingClientRect();return [b.x,b.y,b.width,b.height,getComputedStyle(c).cursor]})()};});
console.log('manual credit row',JSON.stringify(r)); fs.writeFileSync('v7.json',JSON.stringify(r));
await A.screenshot({path:'v7-list-with-manual.png'});
if(r){ const c=r.noCell; await A.mouse.click(c[0]+30,c[1]+c[3]/2); await A.waitForTimeout(3000); console.log('after click url',A.url()); await A.screenshot({path:'v7-after-click-manual.png'}); }
process.exit(0);
