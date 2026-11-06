// SV-7898 retest of the fix (80307): New Note window, type text, [Attach Files photo unless NOPHOTO=1], go OFFLINE, tap Save once.
// Read the window at +3 s and +20 s (message? window open? text+photo kept? any request sent?), then back online, tap Save again,
// and confirm on the server that the note exists once, with the photo. Also records any "Network Error" toast that appears while offline without tapping Save.
import {sess} from './common.mjs'; import fs from 'fs'; const TAG=process.env.TAG||'R-newnote-offline'; const NOPHOTO=process.env.NOPHOTO==='1';
const s=await sess({device:process.env.DEVICE||'iPhone 12 Pro',dir:process.env.QDIR||'/tmp/qa91'}); const p=s.page; const wo=process.argv[2]; const T0=Date.now(); const out=[]; const L=(...a)=>{const t=`+${((Date.now()-T0)/1000).toFixed(1)}s `+a.join(' '); out.push(t); console.log(t);};
await p.addInitScript(()=>{ const o=window.setTimeout; window.setTimeout=function(fn,ms,...a){ if(typeof fn==='function'&&/location\.href/.test(String(fn))) return 0; return o.call(this,fn,ms,...a); }; });
const reqs=[]; p.on('request',r=>{ if(/\/api\/note/.test(r.url())&&r.method()!=='GET'){ reqs.push(r.url()); L('REQ',r.method(),r.url().replace(/^https:\/\/[^/]+/,'')); } });
p.on('response',r=>{ if(/\/api\/note/.test(r.url())&&r.request().method()!=='GET') L('RES',r.status(),r.url().replace(/^https:\/\/[^/]+/,'')); });
p.on('requestfailed',r=>{ if(/\/api\/note/.test(r.url())) L('FAILED',r.url().replace(/^https:\/\/[^/]+/,''),r.failure()?.errorText); });
const st=async n=>{ const r=await p.evaluate(()=>{ const vis=e=>{const b=e.getBoundingClientRect(); return b.width>0&&b.height>0;}; const box=e=>{const b=e.getBoundingClientRect(); return [Math.round(b.x),Math.round(b.y),Math.round(b.width),Math.round(b.height)];};
  const dlg=document.querySelector('.q-dialog'); const save=document.querySelector('[data-test-id="button_save_note"]');
  return {dialog:!!(dlg&&dlg.querySelector('[data-test-id="button_save_note"]')), save: save?{text:save.innerText.trim(),loading:save.classList.contains('q-btn--loading')||!!save.querySelector('.q-spinner'),disabled:save.disabled||save.classList.contains('disabled'),box:box(save)}:null,
    text:(document.querySelector('[data-test-id="input_note_content"]')?.innerText||'').trim().slice(0,80), pending:[...document.querySelectorAll('[data-test-id^="pending_attachment_"]')].filter(vis).map(e=>({t:e.innerText.replace(/\s+/g,' ').trim().slice(0,60),box:box(e)})),
    msgs:[...document.querySelectorAll('.q-notification, .q-dialog [role="alert"], .q-dialog .text-negative, .q-dialog [data-test-id*="error"], .q-dialog [data-test-id*="offline"]')].filter(vis).map(e=>({t:e.innerText.replace(/\s+/g,' ').trim().slice(0,160),id:e.getAttribute('data-test-id')||e.className.slice(0,40),box:box(e)}))}; });
  L(`[${n}]`,JSON.stringify(r)); fs.writeFileSync(`../ev/${TAG}-${n}.json`,JSON.stringify(r)); await p.screenshot({path:`../ev/${TAG}-${n}.png`}); return r; };
await s.go(`/workorders/${wo}/notes`); await p.waitForTimeout(3000);
await p.click('[data-test-id="button_new_note"]'); await p.waitForTimeout(1500); await p.click('[data-test-id="input_note_content"]'); await p.keyboard.type('ZZAUTOTEST SV7898 retest '+TAG);
if(!NOPHOTO){ const fc=p.waitForEvent('filechooser'); await p.click('[data-test-id="button_note_attach_files"]'); await (await fc).setFiles('/tmp/sv7898/image.jpg'); await p.waitForTimeout(1500); }
await st('before-offline');
await s.ctx.setOffline(true); L('offline'); await p.waitForTimeout(+(process.env.PRE||3000)); await st('offline-before-save');
await p.click('[data-test-id="button_save_note"]'); L('tapped Save (offline)'); await p.waitForTimeout(3000); await st('offline-save+3s'); await p.waitForTimeout(17000); await st('offline-save+20s');
const sentOffline=reqs.length; L('note write requests while offline:',sentOffline);
await s.ctx.setOffline(false); L('online'); await p.waitForTimeout(5000); await st('online+5s');
await p.click('[data-test-id="button_save_note"]').catch(e=>L('save click err',e.message.slice(0,80))); L('tapped Save (online)'); await p.waitForTimeout(12000); await st('online-save+12s');
await s.go(`/workorders/${wo}/notes`); await p.waitForTimeout(4000);
const nl=await s.api(`/api/notes?search=&reference_ids%5B0%5D=${wo}&pagination%5BsortBy%5D=created_at&pagination%5Bdescending%5D=true`); const ns=(nl.json?.data?.notes||[]).filter(x=>(x.content||'').includes(TAG));
L('SERVER notes with tag:',ns.length, JSON.stringify(ns.map(n=>({id:n.id,att:(n.attachments||[]).map(a=>a.name||a.fileName||a.originalName||a.id)}))));
const card=await p.$(`text=${TAG}`); if(card){ await card.scrollIntoViewIfNeeded(); await p.waitForTimeout(800);} await p.screenshot({path:`../ev/${TAG}-reload.png`});
fs.writeFileSync(`../ev/${TAG}.log`,out.join('\n')); await s.close(); process.exit(0);
