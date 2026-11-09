// [ENV=prod] node edit.mjs <lastName> <tag> <steps JSON: [["type","Hourly"],["amt","-1"],["save"],["shot","name"]...]> -> drives the Edit Staff dialog, records the salary field + writes per step, reopens
import {sess} from './common.mjs'; import {dlgText,pick,setSalary,salaryField,openEdit} from './lib.mjs'; import fs from 'fs';
const [LAST,TAG,ST]=process.argv.slice(2); const steps=JSON.parse(ST); const env=process.env.ENV||'branch';
const s=await sess(); const p=s.page; await openEdit(p,s,LAST); const out={env,LAST,TAG,start:await salaryField(p),steps:[]};
for(const [k,v] of steps){
  if(k==='type'){ await pick(p,'select_salary_type',v); await p.waitForTimeout(400); }
  if(k==='amt'){ await setSalary(p,v); }
  if(k==='shot'){ await p.screenshot({path:`/tmp/sv12183/${env}-${TAG}-${v}.png`}); }
  if(k==='save'){ const n0=s.writes.length; await p.locator('.q-dialog [data-test-id="button_save_staff"]').click(); await p.waitForTimeout(2500); out.steps.push({save:s.writes.slice(n0).map(w=>w.slice(0,260)),dialogOpen:await p.locator('.q-dialog').count()}); continue; }
  if(k==='reopen'){ await openEdit(p,s,LAST); }
  out.steps.push({k,v,field:await salaryField(p)});
}
const L=(await s.api('/api/staff?search='+encodeURIComponent(LAST))).json?.data; const me=(L?.collection||L||[]).find(x=>x.last_name===LAST); out.listed=me?{salary:me.salary,type:me.salary_type}:null;
fs.writeFileSync(`/tmp/sv12183/${env}-${TAG}.json`,JSON.stringify(out,null,1));
for(const x of out.steps) console.log(x.k? `${x.k} ${x.v} -> value=${x.field.value} label=${x.field.label} error="${x.field.error}"` : `SAVE writes=${JSON.stringify(x.save)} dialogOpen=${x.dialogOpen}`); console.log('listed',JSON.stringify(out.listed));
await s.close(); process.exit(0);
