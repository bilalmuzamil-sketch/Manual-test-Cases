// usage: ENTRY=toolbar|card|newnote MODE=abort|offline|503|500|400|413|hang|slow|none ACTION=retry|discard|none TAG=x node run.mjs <woId>
// phone emulation (iPhone 12 Pro). Breaks the photo upload the chosen way, then reads the screen: toasts, the note card banner, buttons, attachments.
import {sess} from './common.mjs'; import fs from 'fs';
const E=process.env.ENTRY||'toolbar', M=process.env.MODE||'abort', A=process.env.ACTION||'none', TAG=process.env.TAG||`${E}-${M}-${A}`, F=process.env.FILE||'/tmp/sv7898/image.jpg';
const s=await sess({device:process.env.DEVICE||'iPhone 12 Pro',dir:process.env.QDIR||'/tmp/qa89'}); const p=s.page; const wo=process.argv[2]; const log=[]; const T0=Date.now(); const L=(...a)=>{const t=`+${((Date.now()-T0)/1000).toFixed(1)}s `+a.join(' '); log.push(t); console.log(t);};
let NOTE=null; p.on('response',async r=>{ const u=r.url(); if(/\/api\/note\//.test(u)&&r.request().method()!=='GET'){ L('RES',r.status(),u.replace(/^https:\/\/[^/]+/,'')); if(/note\/create/.test(u)&&r.status()<300){ try{ const j=await r.json(); NOTE=j?.data?.note_id||j?.data?.id||JSON.stringify(j).slice(0,120); L('NOTE',NOTE);}catch(e){} } } });
p.on('requestfailed',r=>{ if(/\/api\/note\//.test(r.url())) L('FAILED',r.url().replace(/^https:\/\/[^/]+/,''),r.failure()?.errorText); });
p.on('framenavigated',f=>{ if(f===p.mainFrame()) L('NAV',f.url()); });
const rects=async(n)=>{ const r=await p.evaluate(()=>{ const q=(sel,lab)=>[...document.querySelectorAll(sel)].filter(e=>{const b=e.getBoundingClientRect(); return b.width>0&&b.height>0;}).map(e=>{const b=e.getBoundingClientRect(); return {lab,text:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,120),x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height)};});
  return [...q('[data-test-id="note_upload_failed"]','banner'),...q('[data-test-id="button_retry_note_upload"]','retry'),...q('[data-test-id="button_discard_note_upload"]','discard'),...q('[data-test-id="note_upload_progress"]','progress'),...q('.q-notification','toast'),...q('[data-test-id="button_save_note"]','save'),...q('[data-test-id="pending_attachment_0"]','pending'),...q('[data-test-id^="note_attachment_card_"]','attachment'),...q('[data-test-id="button_attach_files"]','paperclip')]; }); fs.writeFileSync(`../ev/${TAG}-${n}.json`,JSON.stringify(r)); };
const shot=async n=>{ await rects(n); try{ await p.screenshot({path:`../ev/${TAG}-${n}.png`,timeout:8000}); }catch(e){ const c=await s.ctx.newCDPSession(p); const r=await c.send('Page.captureScreenshot',{format:'png'}); fs.writeFileSync(`../ev/${TAG}-${n}.png`,Buffer.from(r.data,'base64')); await c.detach(); } };
const read=async(n)=>{ if(process.env.SCROLL) await p.evaluate((st)=>{ const e=(st&&document.querySelector(st))||document.querySelector('[data-test-id="note_upload_failed"]')||document.querySelector('[data-test-id="note_upload_progress"]')||document.querySelector('[data-test-id^="note_attachment_card_"]')||document.querySelector('[data-test-id="button_note_actions"]'); if(e) e.scrollIntoView({block:'center'}); },process.env.SCROLLTO||null); await p.waitForTimeout(400); const r=await p.evaluate(()=>({toasts:[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim()),
  ids:[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(x=>/note_upload|retry|discard|attach/i.test(x)).map(x=>x+(document.querySelector(`[data-test-id="${x}"]`).innerText?(':'+document.querySelector(`[data-test-id="${x}"]`).innerText.replace(/\s+/g,' ').trim().slice(0,140)):''))}));
  L(`[${n}] toasts=`+JSON.stringify(r.toasts)+' ids='+JSON.stringify([...new Set(r.ids)])); await shot(n); return r; };
const URL_ = E==='toolbar'&&process.env.BREAK==='create' ? '**/api/note/create' : '**/api/note/add-attachments';
let hold=[];
const arm=async()=>{ if(M==='none'||M==='slow'||M==='offline'||M==='latency') return;
  await p.route(URL_, async rt=>{ L('ROUTE',M);
    if(M==='abort') return rt.abort('internetdisconnected');
    if(M==='hang') { hold.push(rt); return; }
    return rt.fulfill({status:+M,contentType:'application/json',body:JSON.stringify({errors:[{error:'ZZAUTOTEST simulated '+M}]})}); }); };
const cdp=await s.ctx.newCDPSession(p);
if(process.env.NOSLEEP!=='0') await p.addInitScript(()=>{ const o=window.setTimeout; window.setTimeout=function(fn,ms,...a){ if(typeof fn==='function'&&/location\.href/.test(String(fn))){ console.log('ZZ blocked QA-env sleep redirect'); return 0; } return o.call(this,fn,ms,...a); }; });
p.on('console',m=>{ if(/ZZ blocked/.test(m.text())) L('BLOCKED QA-env sleep redirect timer'); });
await s.go(`/workorders/${wo}/notes`); await p.waitForTimeout(3000);
const notesBefore=await p.evaluate(()=>document.querySelectorAll('[data-test-id^="note_card"],[data-test-id*="note_card"]').length);
await arm();
if(M==='latency') await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:+(process.env.LAT||150000),downloadThroughput:-1,uploadThroughput:-1});
if(M==='slow') await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:200,downloadThroughput:200*1024,uploadThroughput:40*1024});
const pick=async(sel)=>{ const fc=p.waitForEvent('filechooser',{timeout:10000}); await p.click(sel); const ch=await fc; if(M==='offline') await s.ctx.setOffline(true); await ch.setFiles(F); };
if(E==='toolbar') await pick('[data-test-id="button_attach_files"]');
else if(E==='newnote'){ await p.click('[data-test-id="button_new_note"]'); await p.waitForTimeout(1500); await read('dialog');
  const ed=await p.$('[contenteditable="true"],textarea'); if(ed){ await ed.click(); await p.keyboard.type('ZZAUTOTEST SV7898 new note '+TAG); }
  const ids=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id'))); L('dialog ids',JSON.stringify([...new Set(ids)]));
  const att=ids.find(x=>/attach/i.test(x)); await pick(`.q-dialog [data-test-id="${att}"]`); await p.waitForTimeout(1500); await read('dialog-picked');
  const save=ids.find(x=>/save|create|submit/i.test(x)); L('save',save); await p.click(`.q-dialog [data-test-id="${save}"]`); }
else if(E==='card'){ const first=await p.$('[data-test-id*="note"] [data-test-id*="menu"], [data-test-id*="note_actions"], [data-test-id*="more"]');
  const menus=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(x=>/menu|more|kebab|action/i.test(x))); L('menus',JSON.stringify([...new Set(menus)]));
  const mid=process.env.MENU||menus.find(x=>/note/i.test(x)); await p.click(`[data-test-id="${mid}"] >> nth=0`); await p.waitForTimeout(1000);
  const items=await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id], .q-menu .q-item')].map(e=>(e.getAttribute('data-test-id')||'')+'|'+e.innerText.trim())); L('menu items',JSON.stringify(items));
  await pick('.q-menu >> text=Add Attachment'); }
const t0=Date.now();
for(const w of (M==='hang'||M==='latency'?[2,10,40,100,140,170]:M==='slow'?[1,3,6,10,20]:[2,6])){ await p.waitForTimeout(Math.max(0,w*1000-(Date.now()-t0))); await read('t'+w); }
if(M==='offline') { await s.ctx.setOffline(false); L('back online'); }
if(M==='slow'||M==='latency') await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
if(A!=='none'){ await p.unroute(URL_); for(const h of hold) await h.abort().catch(()=>{});
  await p.waitForTimeout(1000); const sel=A==='retry'?'[data-test-id="button_retry_note_upload"],[data-test-id="button_retry_attach_files"]':'[data-test-id="button_discard_note_upload"]';
  const ok=await p.$(sel); L('action',A,'control found',!!ok); if(ok){ await ok.click(); await p.waitForTimeout(+(process.env.WAITAFTER||12000)); await read('after-'+A); } }
await s.go(`/workorders/${wo}/notes`).catch(e=>L("reload err",e.message.slice(0,80))); await p.waitForTimeout(4000); await read("reload");
const nl=await s.api(`/api/notes?search=&reference_ids%5B0%5D=${wo}&pagination%5BsortBy%5D=created_at&pagination%5Bdescending%5D=true`); const notes=nl.json?.data?.notes||[];
const mine=NOTE?notes.find(n=>n.id===NOTE):notes[0]; L('SERVER note',mine?mine.id:'none','content='+JSON.stringify(mine?.content),'attachments='+JSON.stringify((mine?.attachments||mine?.files||[]).map(a=>a.name||a.fileName||a.originalName||a.id)), 'keys='+(mine?Object.keys(mine).join(','):''));
fs.writeFileSync(`../ev/${TAG}.log`,log.join('\n')); await s.close(); process.exit(0);
