import {prod} from '../common.mjs'; import fs from 'fs'; const NEW=process.argv[2]; const s=await prod('/tmp/qa72'); const p=s.page; const R={marker:await s.marker()}; let n=30;
const read=()=>p.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop(); if(!d) return null; return {head:d.innerText.split('\n')[0],
  fields:[...d.querySelectorAll('.q-field')].map(f=>({label:(f.querySelector('.q-field__label')?.innerText||'').trim(),ph:[...f.querySelectorAll('input,textarea')].map(i=>i.getAttribute('placeholder')).join('|'),val:[...f.querySelectorAll('input,textarea')].map(i=>i.value).join('|').slice(0,80),sel:(f.querySelector('.q-field__native')?.innerText||'').trim().slice(0,80)})).filter(f=>f.label).slice(0,2)};});
const edit=async(wo,tag)=>{ const ls=(await s.api(`/api/work-orders/lines/${wo}`)).json?.data?.collection||[]; const l=ls.find(x=>!/complete|declined/i.test(x.status||x.line_status||''))||ls[0]; if(!l) return {none:true};
  await s.go(`/workorders/${wo}/lines`); await p.waitForTimeout(5000); const c=p.locator('[data-test-id="line_title"]').first(); if(!(await c.count())) return {noTitleCell:true,lines:ls.length};
  await c.click(); await p.waitForTimeout(2000); const d=await read(); n++; await p.screenshot({path:`sv10130/${n}-edit-${tag}.png`});
  const close=p.locator('.q-dialog [data-test-id="button_close_dialog"]').first(); if(await close.count()) await close.click(); await p.waitForTimeout(1000);
  const after=((await s.api(`/api/work-orders/lines/${wo}`)).json?.data?.collection||[]).find(x=>x.line_id===l.line_id);
  return {wo,line:l.line_id,status:l.status,api_before:[l.line_name,l.description],dialog:d,api_after:[after?.line_name,after?.description],updated:[l.updated_at,after?.updated_at]}; };
R.newLine=await edit(NEW,'new');
for(const old of ['6f42701c-5a40-486d-837c-6c012383541b','13667d39-8898-4371-931e-72067c208592','7afc6b2d-0b32-4e9d-8ef7-9fc795d97653','f7fc549d-5b80-439b-b610-a64fdabe8c68']){ const r=await edit(old,'old'); if(!r.none&&!r.noTitleCell&&r.dialog){ R.oldLine=r; break;} R['skip_'+old.slice(0,8)]=r; }
fs.writeFileSync('sv10130/result4.json',JSON.stringify(R,null,1)); console.log(JSON.stringify(R,null,1).slice(0,4000)); await s.close(); process.exit(0);
