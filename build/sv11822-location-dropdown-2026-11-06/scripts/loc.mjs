// node loc.mjs <dpr> <tag> [workplaceName] -> branch sv11839 at 1536x936 with the given devicePixelRatio; optionally switches active location (API), reloads, opens Profile, clicks the location chip, reports the .q-menu position/visibility/items
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const rd=f=>fs.readFileSync('/tmp/sv7898/'+f,'utf8').trim(); const [dpr,tag,wpName]=process.argv.slice(2);
const dir=process.env.DIR||'/tmp/qa95'; fs.mkdirSync(dir,{recursive:true});
const s=process.env.ENV==='prod'? await open({env:'prod',dir,user:'bilal.muzamil@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw.txt','utf8').trim(),dpr:Number(dpr),vp:{width:1536,height:936}})
 : await open({env:'branch',ticket:'11839',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dpr:Number(dpr),vp:{width:1536,height:936},dir});
const p=s.page; await s.go('/dashboard'); await p.waitForTimeout(3000);
const ver=await p.evaluate(()=>document.querySelector('meta[name=app-version]')?.content); console.log('BUILD',ver,'DPR',await p.evaluate(()=>devicePixelRatio),'VP',await p.evaluate(()=>innerWidth+'x'+innerHeight));
const wps=(await s.api('/api/staff/my-workplaces')).json.data.collection; console.log('WPS',wps.map(w=>w.name).join(' | '));
if(wpName){ const w=wps.find(x=>x.name===wpName); const r=await s.api('/api/iam/change-location',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:w.id,workplace_timezone:w.timezone})}); console.log('change-location',r.status);
  await p.evaluate(w=>{ for(const k of Object.keys(localStorage)) if(/location|workplace/i.test(k)) console.log(k); },w); }
if(process.env.CPU){ const c=await p.context().newCDPSession(p); await c.send('Emulation.setCPUThrottlingRate',{rate:Number(process.env.CPU)}); console.log('CPU throttle',process.env.CPU); }
if(process.env.DELAY){ await p.route(/staff\/my-workplaces/,async r=>{ await new Promise(x=>setTimeout(x,Number(process.env.DELAY))); await r.continue(); }); console.log('DELAY my-workplaces',process.env.DELAY); }
await p.reload(); await p.waitForTimeout(Number(process.env.WAIT||4000));
console.log('LS',JSON.stringify(await p.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>/location|workplace/i.test(k)).map(([k,v])=>[k,v.slice(0,120)])))));
await p.click('[data-test-id=profile_menu_button]'); await p.waitForTimeout(Number(process.env.MWAIT||1500));
const ids=await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id]')].map(e=>e.getAttribute('data-test-id'))); console.log('PROFILE IDS',ids.join(' '));
await p.screenshot({path:`../ev/${tag}-1-profile.png`});
const chip=p.locator('.q-menu .q-select, .q-menu [data-test-id*=location]').first(); const cb=await chip.boundingBox(); console.log('CHIP',JSON.stringify(cb));
await p.mouse.click(cb.x+cb.width/2,cb.y+cb.height/2); await p.waitForTimeout(Number(process.env.CWAIT||1500));
const early=await p.evaluate(()=>{const m=document.querySelector('.location-selector__menu, .limit-select-options'); if(!m) return null; const r=m.getBoundingClientRect(); return {style:m.getAttribute('style'),y:r.y}}); console.log('EARLY',JSON.stringify(early)); await p.waitForTimeout(3000);
const menus=await p.evaluate(()=>[...document.querySelectorAll('.q-menu')].map(m=>{const r=m.getBoundingClientRect(); const cs=getComputedStyle(m); return {cls:m.className.slice(0,80),style:m.getAttribute('style'),x:r.x,y:r.y,w:r.width,h:r.height,vis:cs.visibility,items:[...m.querySelectorAll('[data-test-id^=option_item_], .q-item')].map(i=>i.innerText.trim()).slice(0,8)};}));
console.log('MENUS',JSON.stringify(menus,null,0));
await p.screenshot({path:`../ev/${tag}-2-chip.png`});
fs.writeFileSync(`../ev/${tag}.json`,JSON.stringify({ver,dpr,wpName,menus,chip:cb},null,1));
await s.close(); process.exit(0);
