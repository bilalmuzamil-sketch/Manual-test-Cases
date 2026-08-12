const { makeHarness, APP, OUT } = require('./harness_admin.cjs');
const fs=require('fs');
const SNAP=()=>{const vis=e=>{const r=e.getBoundingClientRect();if(r.width<=0||r.height<=0)return false;const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden';};
 const p=[];document.querySelectorAll('.q-menu,.q-dialog,[role="dialog"],[role="menu"]').forEach(d=>{if(vis(d))p.push((d.innerText||'').replace(/\s+/g,' ').trim().slice(0,600));});return p;};
(async()=>{const h=await makeHarness('cell');const page=h.page;const log=[];
 await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:120000});await page.waitForTimeout(11000);
 // geometry of the grid: resource header column vs the time area
 const geo=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
   const cal=document.querySelector('[data-test-id="schedule_calendar"]').getBoundingClientRect();
   const hdrs=[...document.querySelectorAll('[data-test-id="text_schedule_resource_header"]')].filter(vis).map(e=>{const r=e.getBoundingClientRect();return{x:r.x,w:r.width,y:r.y,h:r.height,t:(e.innerText||'').trim().slice(0,30)};});
   const lanes=[...document.querySelectorAll('.schedule-lane')].filter(vis).map(e=>{const r=e.getBoundingClientRect();return{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),blocks:e.querySelectorAll('[data-test-id*="block"]').length};});
   return {cal:{x:cal.x,y:cal.y,w:cal.width,h:cal.height},hdrs:hdrs.slice(0,4),lanes:lanes.slice(0,14),vh:innerHeight,vw:innerWidth};});
 console.log('GEOMETRY:',JSON.stringify(geo,null,1).slice(0,1400));
 // click well to the RIGHT of the resource header, in a block-free lane, at several x positions
 for(const frac of [0.35,0.55,0.8]){
   const c=await page.evaluate((frac)=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
     const cal=document.querySelector('[data-test-id="schedule_calendar"]');
     const lanes=[...cal.querySelectorAll('.schedule-lane')].filter(e=>vis(e)&&e.querySelectorAll('[data-test-id*="block"]').length===0);
     const ln=lanes[Math.floor(lanes.length/2)];if(!ln)return null;ln.scrollIntoView({block:'center'});
     return new Promise(res=>setTimeout(()=>{const r=ln.getBoundingClientRect();const cr=cal.getBoundingClientRect();
       res({x:Math.round(cr.x+cr.width*frac),y:Math.round(r.y+r.height/2),laneW:Math.round(r.width),calW:Math.round(cr.width)});},600));},frac);
   if(!c)continue;
   await page.mouse.click(c.x,c.y);await page.waitForTimeout(1700);
   let p=await page.evaluate(SNAP);
   log.push({gesture:'left',frac,coord:c,panels:p});
   console.log(` left x@${frac} (${c.x},${c.y}) -> ${p.length} panel(s) ${JSON.stringify(p).slice(0,220)}`);
   await page.keyboard.press('Escape');await page.waitForTimeout(500);
   await page.mouse.click(c.x,c.y,{button:'right'});await page.waitForTimeout(1700);
   p=await page.evaluate(SNAP);
   log.push({gesture:'right',frac,coord:c,panels:p});
   console.log(` right x@${frac} -> ${p.length} panel(s) ${JSON.stringify(p).slice(0,220)}`);
   await page.keyboard.press('Escape');await page.waitForTimeout(500);
 }
 await page.screenshot({path:`${OUT}/cell-final.png`}).catch(()=>{});
 fs.writeFileSync(`${OUT}/cell-menu-attempts.json`,JSON.stringify({read_at_utc:new Date().toISOString(),geometry:geo,attempts:log,non_get:h.apiLog.filter(a=>a.m!=='GET')},null,1));
 console.log('NON-GET:',JSON.stringify(h.apiLog.filter(a=>a.m!=='GET')));
 await h.browser.close();})();
