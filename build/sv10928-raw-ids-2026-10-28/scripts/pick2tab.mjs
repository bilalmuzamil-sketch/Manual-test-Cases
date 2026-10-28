// Bulk pick in two tabs: tab A and tab B both select the line and open More; tab B picks first; then tab A picks -> error text
// usage: node pick2tab.mjs <env> <wo> <lineId> [dry]
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,wo,line,dry]=process.argv.slice(2); const out=`/tmp/s10928/${env}-pick`; fs.mkdirSync(out,{recursive:true});
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'10928',cookies,dir:(process.env.QA_DIR||'/tmp/qa24'),user:'bilal.muzamil@shopview.com'}); const R={env};
const prep=async pg=>{ await pg.goto(s.host.app+`/workorders/${wo}/lines`,{waitUntil:'domcontentloaded'}); await pg.waitForTimeout(6000);
  const ln=pg.locator(`[data-test-id="line_number_${line}"]`); await ln.scrollIntoViewIfNeeded(); await ln.hover(); await pg.waitForTimeout(500);
  const bb=await pg.locator(`[data-test-id="line_checkbox_${line}"]`).boundingBox(); await pg.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await pg.waitForTimeout(900);
  await pg.locator('[data-test-id="button_bulk_more"]').click(); await pg.waitForTimeout(1200);
  return pg.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>(e.getAttribute('data-test-id')||'')+'|'+e.innerText.replace(/\s+/g,' ').trim())); };
const A=s.page; R.menuA=await prep(A); console.log('menu',R.menuA.join(' ;; ')); await A.screenshot({path:out+'/A-menu.png'});
if(dry){ await s.close(); process.exit(0); }
const B=await s.ctx.newPage(); await prep(B);
const pickItem=pg=>pg.locator('.q-menu .q-item',{hasText:/^\s*Pick/}).first();
const toastsOf=async pg=>{ const t=[]; for(let i=0;i<20;i++){ for(const x of await pg.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim()))) if(!t.includes(x)) t.push(x); await pg.waitForTimeout(250);} return t; };
await pickItem(B).click(); await B.waitForTimeout(1500); R.dialogB=await B.evaluate(()=>document.querySelector('.q-dialog')?.innerText.replace(/\s+/g,' ').slice(0,300)); await B.screenshot({path:out+'/B-after-pick-click.png'});
R.toastsB=await toastsOf(B);
await pickItem(A).click(); await A.waitForTimeout(1500); R.dialogA=await A.evaluate(()=>document.querySelector('.q-dialog')?.innerText.replace(/\s+/g,' ').slice(0,300)); await A.screenshot({path:out+'/A-after-pick-click.png'});
R.toastsA=await toastsOf(A); await A.screenshot({path:out+'/A-error.png'});
console.log(JSON.stringify(R,null,1).slice(0,2500)); fs.writeFileSync(out+'/result.json',JSON.stringify(R,null,1)); await s.close();
