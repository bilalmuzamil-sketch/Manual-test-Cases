// Sample the Edit Order Item Manufacturer field every 200 ms for 15 s after opening the dialog
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,po]=process.argv.slice(2);
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa25'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
const out=[];
for(let run=1;run<=3;run++){
  await s.go('/order/'+po); for(let i=0;i<30;i++){ if(await p.evaluate(()=>!![...document.querySelectorAll('table button')].find(x=>/edit_note/.test(x.innerText)))) break; await p.waitForTimeout(500); }
  const t0=Date.now(); await p.evaluate(()=>{ const b=document.querySelector('[data-test-id^="button_edit_order_item_"]')||[...document.querySelectorAll('table button')].find(x=>/edit_note/.test(x.innerText)); b.click(); });
  const seq=[]; let last=null;
  while(Date.now()-t0<15000){ const v=await p.evaluate(()=>{ const f=[...document.querySelectorAll('.q-dialog .q-field')].find(x=>/Manufacturer/.test(x.innerText)); return f?f.innerText.replace(/\s+/g,' ').replace('Manufacturer','').replace('arrow_drop_down','').trim():'(no field)'; });
    if(v!==last){ seq.push([Date.now()-t0,v]); last=v; if(/[0-9a-f]{8}-/.test(v)&&!fs.existsSync(`/tmp/s10928/posample-${env}-${run}.png`)) await p.screenshot({path:`/tmp/s10928/posample-${env}-${run}.png`}); } await p.waitForTimeout(200); }
  out.push(seq); console.log('run',run,JSON.stringify(seq)); await p.keyboard.press('Escape'); }
fs.writeFileSync(`/tmp/s10928/posample-${env}.json`,JSON.stringify(out)); await s.close(); process.exit(0);
