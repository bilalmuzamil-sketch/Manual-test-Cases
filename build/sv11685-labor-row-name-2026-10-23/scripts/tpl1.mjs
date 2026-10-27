import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:1});
const p=s.page; const reqs=[]; p.on('request',r=>{if(/adjustment-templates/.test(r.url())&&r.method()!=='GET') reqs.push(r.method()+' '+r.url().replace(/https:\/\/[^/]+/,'')+' '+(r.postData()||''));}); p.on('response',async r=>{if(/adjustment-templates/.test(r.url())&&r.request().method()!=='GET'){try{reqs.push('  -> '+r.status()+' '+(await r.text()).slice(0,300))}catch{}}});
await s.go('/administration/adjustment-templates'); await p.waitForTimeout(6000); console.log('url',p.url());
const ids=await p.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')))].filter(t=>/templ|adjust|new|add|create/i.test(t))); console.log('ids',JSON.stringify(ids));
const nb=ids.find(i=>/^button_.*(new|add|create)/i.test(i)&&!/whats_new/.test(i)); if(nb){ await p.click(`[data-test-id="${nb}"]`); await p.waitForTimeout(2000);
 const d=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id'))); console.log('dialog',JSON.stringify(d));
 console.log('text',(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(x=>x.innerText).join(' '))).replace(/\s+/g,' ').slice(0,700));
 await p.screenshot({path:'/tmp/qa11685/w/fee/tpl-dialog.png'});
 await p.click('.q-dialog [data-test-id="select_adjustment_template_calc_type"]'); await p.waitForTimeout(900);
 console.log('calc opts',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim()))));
 const pl=p.locator('.q-menu .q-item',{hasText:/Labor/i}); if(await pl.count()) await pl.first().click(); else await p.keyboard.press('Escape'); await p.waitForTimeout(700);
 await p.locator('.q-dialog [data-test-id="input_adjustment_template_name"]').locator('input').first().fill('ZZAUTOTEST labor fee 10').catch(async()=>p.fill('.q-dialog [data-test-id="input_adjustment_template_name"]','ZZAUTOTEST labor fee 10'));
 const ids2=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id'))); const am=ids2.find(i=>/percent|amount/i.test(i)&&!/max/i.test(i)); console.log('amount field',am);
 const loc=p.locator(`.q-dialog [data-test-id="${am}"]`); const inner=loc.locator('input'); if(await inner.count()) await inner.first().fill('10'); else await loc.fill('10');
 await p.waitForTimeout(500); await p.click('.q-dialog [data-test-id="button_save_adjustment_template"]'); await p.waitForTimeout(3000);
 console.log('toast',await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ')).join(' | ')));
 console.log(reqs.join('\n')); }
process.exit(0);
