import {session} from './rec.mjs'; import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const SH=`/tmp/qa11310/ex20/${env}-`; const add=process.argv[3]||'Esther Howard'; const tag=process.argv[4]||'a';
const W=JSON.parse(fs.readFileSync(`/tmp/qa11310/ex20/wo-${env}.json`));
const s= env==='prod'? await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa11310',vp:{width:1440,height:900}}) : await session({vp:{width:1440,height:900}});
const p=s.page; const log={mk:await s.marker(),wo:W}; const reqs=[]; p.on('response',async r=>{const q=r.request(); if(/\/api\//.test(q.url())&&!/sentry|preferences|notifications|envelope/.test(q.url())) reqs.push({m:q.method(),u:q.url().replace(/^https:\/\/[^/]+/,'').slice(0,160),st:r.status(),b:(q.postData()||'').slice(0,300)});});
const dlg=()=>p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,1200)));
const openAudit=async(name)=>{ const b=await p.$('[data-test-id^=button_line_expand_]'); const r=await b.boundingBox(); for(let k=0;k<6;k++){ await p.mouse.move(r.x+r.width/2,r.y+r.height/2); await p.waitForTimeout(300); await p.mouse.click(r.x+r.width/2+50,r.y+r.height/2); await p.waitForTimeout(900); if(await p.$('.q-menu:has-text("Audit log")')) break; }
 await p.click('.q-menu .q-item:has-text("Audit log")'); await p.waitForTimeout(2500); const t=await dlg(); await p.screenshot({path:SH+name+'.png'}); { const cb=await p.$('.q-dialog [data-test-id=button_close_dialog]'); if(cb){ const bb=await cb.boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);} } await p.waitForTimeout(1200); return t; };
try{
 await s.go(`/workorders/${W.wo}/lines`); await p.waitForTimeout(5500);
 log.labor0=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=line_labor_name_]')].map(e=>e.innerText.trim()));
 log.audit0=await openAudit(tag+'-audit-before');
 { await p.keyboard.press('Escape').catch(()=>{}); await p.waitForTimeout(800); const b=await (await p.$('[data-test-id=line_title]')).boundingBox(); await p.mouse.click(b.x+b.width/2,b.y+b.height/2); await p.waitForTimeout(2500); } log.edit=await dlg(); log.editTids=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.dataset.testId.replace(/[0-9a-f-]{36}/,'{id}')).slice(0,60)); await p.screenshot({path:SH+tag+'-edit-open.png'});
 const sel=await p.$('.q-dialog [data-test-id=select_line_roster_add_technician]'); log.hasAdd=!!sel;
 if(sel){ const bb=await sel.boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(800); await p.keyboard.type(add.split(' ')[0],{delay:60}); await p.waitForTimeout(1500); log.opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(i=>i.innerText.trim()).slice(0,15)); await p.click(`.q-menu .q-item:has-text("${add}")`); await p.waitForTimeout(1500); await p.screenshot({path:SH+tag+'-edit-added.png'}); log.editAfter=await dlg();
  { const sb=await (await p.$('.q-dialog [data-test-id=button_save_close]')).boundingBox(); await p.mouse.click(sb.x+sb.width/2,sb.y+sb.height/2); } await p.waitForTimeout(3500); }
 log.toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ').trim()));
 log.labor1=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=line_labor_name_]')].map(e=>e.innerText.trim())); await p.screenshot({path:SH+tag+'-after-save.png'});
 log.audit1=await openAudit(tag+'-audit-after');
}catch(e){ log.err=e.message.slice(0,300); }
fs.writeFileSync(`/tmp/qa11310/ex20/l2-${env}-${tag}.json`,JSON.stringify({log,reqs},null,1)); console.log(JSON.stringify(log).slice(0,3500)); await s.close();
