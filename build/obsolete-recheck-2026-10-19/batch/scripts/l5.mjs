import {session} from './rec.mjs'; import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const tag=process.argv[3]; const SH=`/tmp/qa11310/ex20/${env}-`; const W=JSON.parse(fs.readFileSync(`/tmp/qa11310/ex20/wo-${env}.json`));
const s= env==='prod'? await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa11310',vp:{width:1440,height:900}}) : await session({vp:{width:1440,height:900}});
const p=s.page; const log={};
const r=await s.api('/api/work-orders/lines/'+W.wo); const L=r.json.data.lines||r.json.data.collection||r.json.data; const ln=Array.isArray(L)?L[0]:L; log.assigned=ln.assigned_techs;
await s.go(`/workorders/${W.wo}/lines`); await p.waitForTimeout(5000);
const b=await p.$('[data-test-id^=button_line_expand_]'); const bb=await b.boundingBox(); for(let k=0;k<6;k++){ await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(300); await p.mouse.click(bb.x+bb.width/2+50,bb.y+bb.height/2); await p.waitForTimeout(900); if(await p.$('.q-menu:has-text("Audit log")')) break; }
await p.click('.q-menu .q-item:has-text("Audit log")'); await p.waitForTimeout(2500);
log.audit=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id=audit_log_row]')].map(r=>r.innerText.replace(/\s+/g,' ').trim()));
await p.screenshot({path:SH+tag+'.png'});
fs.writeFileSync(`/tmp/qa11310/ex20/l5-${env}-${tag}.json`,JSON.stringify(log,null,1)); console.log(JSON.stringify(log)); await s.close();
