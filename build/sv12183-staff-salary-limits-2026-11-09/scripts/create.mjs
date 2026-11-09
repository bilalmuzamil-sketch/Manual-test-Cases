// [ENV=prod] node create.mjs <tag> <Hourly|Salary> <amount> -> Add New Staff Member on screen, save, read back (list + reopen)
import {sess,j} from './common.mjs'; import {dlgText,pick,setSalary,salaryField,openEdit} from './lib.mjs'; import fs from 'fs';
const [TAG,TYPE,AMT]=process.argv.slice(2); const env=process.env.ENV||'branch'; const R=Math.floor(Math.random()*90000+10000);
const last=`SV12183 ${TAG} ${R}`, email=`bilal.muzamil+sv12183${TAG.toLowerCase()}${R}@shopview.com`;
const s=await sess(); const p=s.page; await s.go('/administration/staff'); await p.waitForTimeout(3500);
const ver=await p.evaluate(async()=>{const t=await (await fetch('/index.html?cb='+Date.now(),{cache:'no-store'})).text();return (t.match(/app-version" content="([^"]+)/)||[])[1];});
await p.locator('[data-test-id="button_add_new_staff_member"]').click(); await p.waitForTimeout(1800);
const fill=async(t,v)=>{const i=p.locator(`.q-dialog [data-test-id="${t}"]`); await i.click(); await i.fill(v);};
await fill('input_first_name','ZZAUTOTEST'); await fill('input_last_name',last); await fill('input_email',email);
const ty=await pick(p,'select_salary_type',TYPE); await setSalary(p,AMT);
const role=await pick(p,'select_role','Technician'); const loc=await pick(p,'select_location','Heavy Duty'); await p.locator('.q-dialog [data-test-id="select_multiple_departments"]').click(); await p.waitForTimeout(600); const dep=(await p.locator('.q-menu .q-item').allInnerTexts())[0]; await p.locator('.q-menu .q-item').first().click(); await p.keyboard.press('Escape'); await p.waitForTimeout(400); if(process.env.CLOCK) { await p.locator('.q-dialog [data-test-id="toggle_time_clock"]').click(); await p.waitForTimeout(300);} 
const f1=await salaryField(p); await p.screenshot({path:`/tmp/sv12183/${env}-${TAG}-1-filled.png`});
p.on('request',q=>{ if(/iam\/create/.test(q.url())) fs.writeFileSync(`/tmp/sv12183/${env}-${TAG}-body.json`,q.postData()||''); }); const n0=s.writes.length; await p.locator('.q-dialog [data-test-id="button_save_staff"]').click(); await p.waitForTimeout(3500);
const writes=s.writes.slice(n0).map(w=>w.slice(0,300)); const open=await p.locator('.q-dialog').count(); const dt=open?await dlgText(p):'';
await p.screenshot({path:`/tmp/sv12183/${env}-${TAG}-2-after-save.png`});
const L=(await s.api('/api/staff?search='+encodeURIComponent(last))).json?.data; const arr=L?.collection||L||[]; const me=arr.find(x=>x.last_name===last);
let reopen=null; if(me){ await openEdit(p,s,last); reopen=await salaryField(p); await p.screenshot({path:`/tmp/sv12183/${env}-${TAG}-3-reopen.png`}); }
const out={env,ver,TAG,TYPE,AMT,last,email,typeChosen:ty,role,loc,beforeSave:f1,writes,dialogStillOpen:open,dialogText:dt.slice(0,300),listed:me?{salary:me.salary,type:me.salary_type,id:me.id,staff_id:me.staff_id}:null,reopen};
fs.writeFileSync(`/tmp/sv12183/${env}-${TAG}.json`,JSON.stringify(out,null,1)); console.log(j(out).slice(0,0)); console.log(JSON.stringify({ver,TYPE,AMT,before:f1.value+' err:'+f1.error,writes:writes.map(w=>w.slice(0,140)),open,listed:out.listed,reopen:reopen&&(reopen.value+' '+reopen.label)}));
await s.close(); process.exit(0);
