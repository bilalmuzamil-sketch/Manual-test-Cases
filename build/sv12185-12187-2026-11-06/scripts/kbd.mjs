// node kbd.mjs <woId> -> reporter's exact keyboard path on the inline Add Part row: click + Add Part, type part number, Tab, type description, Tab, type qty (QTY env, default "1"), Enter. Records request/toast/focus/qty value. VAR=... picks variants. ../ev/<env>-kbd-<VAR>.png
import {sess,post} from './common.mjs'; import fs from 'fs';
const E=process.env.ENV==='prod'?'prod':'branch'; const wo=process.argv[2]; const VARS=(process.env.VARS||'a').split(','); const s=await sess(process.env.VP==='1440'?{vp:{width:1440,height:900},dpr:1}:{}); const p=s.page; const out=[];
if(E==='prod'){ const ws=(await s.api('/api/staff/my-workplaces')).json.data; const W=(ws.collection||ws).find(w=>/Trucks Hill 2/.test(w.name)); await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone}); }
if(process.env.SLOW){ await p.route(u=>/inventory-parts-as-options/.test(u.toString()), async r=>{ console.log('delayed',r.request().url().replace(/^https:\/\/[^/]+/,'').slice(0,100)); await new Promise(z=>setTimeout(z,+process.env.SLOW)); await r.continue(); }); }
const gets=[]; p.on('request',r=>{ if(r.method()==='GET'&&/\/api\//.test(r.url())) gets.push(r.url().replace(/^https:\/\/[^/]+/,'').slice(0,120)); });
const reqs=[]; p.on('request',r=>{ if(/\/api\/work-orders\/part/.test(r.url())&&r.method()==='POST') reqs.push(r.url().replace(/^https:\/\/[^/]+/,'')); });
const fx=async()=>p.evaluate(()=>{const a=document.activeElement; return (a?.getAttribute('data-test-id')||a?.closest('[data-test-id]')?.getAttribute('data-test-id'))+'="'+(a?.value||'')+'"';});
let i=0; for(const V of VARS){ i++; await s.go('/workorders/'+wo+'/lines'); await p.waitForTimeout(3500);
  await p.locator('[data-test-id=button_add_part]').nth(+(process.env.LINE||0)).click(); await p.waitForTimeout(1200);
  const f0=await fx(); const pn=process.env.PN||('ZZKB-'+V+'-'+i+'-'+(Date.now()%10000));
  if(!/select_inline_part_number/.test(f0)) await p.locator('[data-test-id=select_inline_part_number]').last().click();
  await p.keyboard.type(pn,{delay:+(process.env.TD||40)}); await p.waitForTimeout(+(process.env.PW??1500)); const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(x=>x.innerText.replace(/\s+/g,' ')).slice(0,4)); const fPn=await fx();
  await p.keyboard.press('Tab'); await p.waitForTimeout(400); const f1=await fx();
  await p.keyboard.type('ZZ kb desc',{delay:+(process.env.TD||30)}); await p.keyboard.press('Tab'); await p.waitForTimeout(300); const f2=await fx();
  if(V==='a') await p.keyboard.type('1',{delay:30});
  if(V==='b'){ await p.keyboard.press('Control+A'); await p.keyboard.type('2',{delay:30}); }
  if(V==='c'){ /* leave qty as is */ }
  if(process.env.WAITQ) await p.waitForTimeout(+process.env.WAITQ); const menuOpen=await p.evaluate(()=>[...document.querySelectorAll('.q-menu')].filter(m=>m.offsetParent!==null||getComputedStyle(m).display!=='none').map(m=>m.innerText.replace(/\s+/g,' ').slice(0,80))); const f3=await fx(); reqs.length=0; await p.evaluate(()=>document.querySelectorAll('.q-notification').forEach(n=>n.remove()));
  await p.keyboard.press(V==='d'?'NumpadEnter':'Enter'); await p.waitForTimeout(2500);
  const toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ')));
  const f4=await fx(); const LJ=JSON.stringify((await s.api('/api/work-orders/lines/'+wo)).json); const saved=(LJ.match(new RegExp(pn.replace(/[-]/g,'\\-'),'g'))||[]).length;
  await p.screenshot({path:`../ev/${E}-kbd-L${process.env.LINE||0}-${V}.png`});
  console.log('GETS',gets.slice(-12).join('\n')); const row={V,pn,menuOpenBeforeEnter:menuOpen,opts,focusStart:f0,afterTypingPn:fPn,afterTab1:f1,afterTab2:f2,beforeEnter:f3,requests:[...reqs],toasts,saved,focusAfter:f4}; out.push(row); console.log(JSON.stringify(row)); }
fs.writeFileSync(`../ev/${E}-kbd-L${process.env.LINE||0}.json`,JSON.stringify(out,null,1)); await s.close(); process.exit(0);
