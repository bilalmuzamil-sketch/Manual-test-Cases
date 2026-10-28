// Manual returns from two different vendors ticked together on Parts → Returns, then Create Return — what the screen allows and says.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const LOC='b617914c-16e9-4485-8e8b-193cd86aa416'; const out=`ev/messages/${env}-mrvendor`; fs.mkdirSync(out,{recursive:true});
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com',vp:{width:1440,height:900}});
const p=s.page; if(env==='prod'){ await s.go('/workorders'); await p.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC); }
await s.go('/parts/returns'); await p.waitForTimeout(6000);
const rows=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="return_request_checkbox_"]:not([data-test-id*="cell"])')].map(e=>({id:e.getAttribute('data-test-id'),manual:!!e.closest('tr')?.querySelector('[data-test-id^="button_manual_return_actions_"]'),t:e.closest('tr')?.innerText.replace(/\s+/g,' ').slice(0,170)})));
console.log('rows',rows.length); rows.slice(0,12).forEach(r=>console.log(r.manual?'M':'-',r.t));
fs.writeFileSync(out+'/rows.json',JSON.stringify(rows,null,1));
if(process.env.TICKTXT) process.env.TICK=process.env.TICKTXT.split(",").map(x=>rows.findIndex(r=>r.t.includes(x))).join(",");
if(process.env.TICK){ for(const i of process.env.TICK.split(",").map(Number)){ { const cell=rows[i].id.replace("return_request_checkbox_","return_request_checkbox_cell_"); const b=await p.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`)||document.querySelector(`[data-test-id="${t.replace("_cell_","_")}"]`)?.closest("td"); if(!e) return {miss:[...document.querySelectorAll("[data-test-id^=return_request_checkbox]")].slice(0,3).map(x=>x.getAttribute("data-test-id"))}; e.scrollIntoView({block:"center"}); const r=(e.querySelector(".q-checkbox")||e).getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},cell); if(b.miss){console.log("MISS",cell,JSON.stringify(b.miss));continue;} await p.mouse.click(b.x,b.y); } await p.waitForTimeout(700); }
  await p.screenshot({path:out+'/1-ticked.png'}); const bt=await p.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>e.getBoundingClientRect().width>0).map(e=>[e.getAttribute('data-test-id'),e.innerText.trim()]).filter(x=>/Return|Credit/i.test(x[1]))); console.log('buttons',JSON.stringify(bt));
  const w0=s.writes.length; await p.locator('button',{hasText:process.env.BTN||'Receive Credit'}).first().click(); await p.waitForTimeout(5000);
  console.log('url',p.url().replace(/^https:\/\/[^/]+/,'')); console.log('toasts',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')))));
  console.log('dialog',JSON.stringify(await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText.replace(/\s+/g,' ').slice(0,400))));
  console.log('tids',[...new Set(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g,'<id>'))))].filter(t=>!/nav|module_|global|clock|notif|profile/.test(t)).join(' ; ').slice(0,1200));
  console.log('writes',JSON.stringify(s.writes.slice(w0).map(w=>w.slice(0,220)))); await p.screenshot({path:out+'/2-after-create.png'}); }
await s.close(); process.exit(0);
