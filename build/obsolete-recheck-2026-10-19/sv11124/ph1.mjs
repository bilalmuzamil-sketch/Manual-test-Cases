import {session} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'tech',vp:{width:1440,height:900},dpr:2}); const p=s.page; const log={mk:await s.marker()}; const reqs=[];
p.on('response',async r=>{const q=r.request(); if(q.method()!=='GET'&&/avatar|photo|profile|user/i.test(q.url())) reqs.push({m:q.method(),u:q.url().replace(/^https:\/\/[^/]+/,'').slice(0,120),st:r.status()});});
// colour of an <img>: draw it on a canvas and read the centre pixel
const col=sel=>p.evaluate(async sel=>{ const out=[]; for(const im of document.querySelectorAll(sel)){ if(!im.complete) await new Promise(r=>{im.onload=r; setTimeout(r,3000);}); const c=document.createElement('canvas'); c.width=c.height=8; const x=c.getContext('2d'); try{ x.drawImage(im,0,0,8,8); const d=x.getImageData(4,4,1,1).data; out.push({src:im.src.slice(0,90),rgb:[d[0],d[1],d[2]]}); }catch(e){ out.push({src:im.src.slice(0,90),err:'tainted'}); } } return out; },sel);
const hdr=()=>col('[data-test-id=profile_menu_button] img');
const up=async (f,tag)=>{ await s.go('/profile'); await p.waitForTimeout(3500); const inp=await p.$('input[type=file]'); await inp.setInputFiles(f); await p.waitForTimeout(4000);
  log[tag+'_dialog']=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>({t:d.innerText.replace(/\s+/g,' ').slice(0,200),b:[...d.querySelectorAll('button')].map(b=>(b.dataset.testId||'')+':'+b.innerText.trim())})));
  for(let i=0;i<3;i++){ const b=await p.evaluateHandle(()=>[...document.querySelectorAll('.q-dialog button')].find(x=>/^(Save|Upload|Confirm|Apply|Crop|OK|Are You Sure\?)$/i.test(x.innerText.trim()))); const e=b.asElement(); if(!e) break; log[tag+'_btn'+i]=await e.innerText(); await e.click(); await p.waitForTimeout(3000); }
  log[tag+'_toast']=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ').trim()));
  log[tag+'_hdr_before_reload']=await hdr(); await p.screenshot({path:`/tmp/qa11310/ex23/${tag}-1-uploaded.png`});
  await p.reload(); await p.waitForTimeout(5000); log[tag+'_hdr_after_reload']=await hdr(); log[tag+'_profile_after_reload']=await col('.q-avatar img, img[alt*=avatar i], .avatar img'); await p.screenshot({path:`/tmp/qa11310/ex23/${tag}-2-reloaded.png`}); };
try{ log.hdr0=await hdr(); await up('/tmp/qa11310/ex23/photoA.png','A'); await up('/tmp/qa11310/ex23/photoB.png','B'); }catch(e){ log.err=e.message.slice(0,300); }
log.reqs=reqs; fs.writeFileSync('/tmp/qa11310/ex23/ph1.json',JSON.stringify(log,null,1)); console.log(JSON.stringify(log).slice(0,3500)); await s.close();
