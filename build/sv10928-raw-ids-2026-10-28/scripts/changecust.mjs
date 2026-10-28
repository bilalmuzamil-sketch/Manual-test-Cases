// Work order -> Change Customer: type in the Customer search so the list is replaced; does the selected customer show an ID?
// usage: node changecust.mjs <branch|prod> <woId> <search1,search2,...>
import {open} from '../../testing-tools/qa-session.mjs'; import * as D from './detect.mjs'; import {click} from './scenarios.mjs'; import fs from 'fs';
const [env,wo,searches]=process.argv.slice(2); const out=`/tmp/s10928/${env}-changecust`; fs.mkdirSync(out,{recursive:true});
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'10928',cookies,dir:(process.env.QA_DIR||'/tmp/qa24'),user:'bilal.muzamil@shopview.com'});
const ctl={ms:3500,maxShots:0}; await D.install(s,ctl); const p=s.page; const R={env,wo,steps:[]};
await s.go(`/workorders/${wo}/lines`); await p.waitForTimeout(4000);
await click(s,'customer_card_change_action'); await p.waitForTimeout(3000); await D.reset(p);
const field=()=>p.evaluate(()=>{ const f=[...document.querySelectorAll('.q-dialog .q-field')].find(x=>/Customer/.test(x.querySelector('.q-field__label')?.innerText||'')); return f?f.innerText.replace(/\s+/g,' ').trim():null; });
R.steps.push({step:'opened',field:await field()});
let i=0; for(const q of searches.split(',')){ i++;
  const f=await p.evaluateHandle(()=>[...document.querySelectorAll('.q-dialog .q-field')].find(x=>/Customer/.test(x.querySelector('.q-field__label')?.innerText||'')));
  const inp=await f.asElement().$('input'); await inp.click(); await p.keyboard.press('Control+A'); await p.keyboard.type(q,{delay:60}); await p.waitForTimeout(3500);
  const menu=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).slice(0,6));
  await p.screenshot({path:`${out}/${i}-typed.png`});
  await p.keyboard.press('Escape'); await p.waitForTimeout(1500);
  R.steps.push({step:'typed '+q, menu, fieldAfterEsc:await field(), hits:(await D.hits(p)).map(h=>h.text.slice(0,60)+' @'+(h.path||'').slice(-60))});
  await p.screenshot({path:`${out}/${i}-after-esc.png`});
  if(!(await p.evaluate(()=>!!document.querySelector('.q-dialog')))){ await click(s,'customer_card_change_action'); await p.waitForTimeout(2500); } }
console.log(JSON.stringify(R,null,1).slice(0,3000)); fs.writeFileSync(out+'/result.json',JSON.stringify(R,null,1)); await s.close();
