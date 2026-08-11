// The four dialogs. Element-centre coordinate clicks (not actionability clicks),
// and the DOM is CHECKED for the dialog rather than the click being trusted.
// admin@shopview.com is deliberately never selected - editing it kills the session.
const {open,DUMP,APP}=require('./harvest.cjs');
const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-11/evidence';
const S={}; const log=[]; const say=(...a)=>{console.log(...a); log.push(a.join(' '));};
const WANT=/Reset To Template|Time Clock|Add hours|business hours for this shop|custom hours for this technician|working hours/i;
(async()=>{
  const {browser,page}=await open();
  const grab=async n=>{ S[n]=await page.evaluate(DUMP); await page.screenshot({path:`${OUT}/dlg-${n}.png`}).catch(()=>{});
    const hits=(S[n].texts||[]).filter(t=>WANT.test(t));
    say(`  [${n}] texts=${S[n].texts.length} WANTED-HITS=${JSON.stringify(hits.slice(0,6))}`); };
  // did a dialog actually open? check the DOM, do not trust the click
  const dlg=async()=>page.evaluate(()=>{
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog],.q-menu,.modal')].filter(e=>{
      const r=e.getBoundingClientRect(); return r.width>100&&r.height>60; });
    return {open:d.length>0,n:d.length,text:d.length?(d[0].innerText||'').slice(0,300):null};
  });
  const clickRowContaining=async(needle,tag,skip=/admin@shopview\.com/)=>{
    const box=await page.evaluate(({needle,skipSrc})=>{
      const skip=new RegExp(skipSrc);
      const rows=[...document.querySelectorAll('tr,[role=row],.q-item,.q-card')].filter(e=>{
        const t=e.textContent||''; return new RegExp(needle,'i').test(t) && !skip.test(t) && e.children.length<=14; });
      if(!rows.length) return null;
      const r=rows[rows.length-1].getBoundingClientRect();
      if(r.width===0||r.height===0) return null;
      return {x:r.x+Math.min(200,r.width*0.35),y:r.y+r.height/2,who:(rows[rows.length-1].textContent||'').trim().slice(0,70)};
    },{needle,skipSrc:skip.source});
    if(!box){ say(`  [${tag}] no row matching /${needle}/`); return false; }
    say(`  [${tag}] clicking row: ${box.who}`);
    await page.mouse.click(box.x,box.y); await page.waitForTimeout(5000);
    const d=await dlg(); say(`  [${tag}] dialog open=${d.open} (n=${d.n})`);
    return d.open; };

  // ---- 1. Roles & Permissions -> a role -> Reset To Template / Time Clock ----
  await page.goto(APP+'/administration/roles-permissions',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(12000); await grab('30-roles-list');
  await clickRowContaining('Technician','31'); await grab('31-role-detail');
  // ---- 2. Staff -> a NON-admin technician -> custom hours ----
  await page.goto(APP+'/administration/staff',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(12000); await grab('32-staff-list');
  await clickRowContaining('@','33'); await grab('33-staff-dialog');
  // if a dialog opened, hunt a working-hours control inside it
  try{
    const b=await page.evaluate(()=>{
      const els=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/hours/i.test(e.textContent||'')&&(e.textContent||'').trim().length<60);
      if(!els.length) return null; const r=els[0].getBoundingClientRect();
      return {x:r.x+r.width/2,y:r.y+r.height/2,t:els[0].textContent.trim()};
    });
    if(b){ say(`  [34] clicking in-dialog hours control: ${b.t}`); await page.mouse.click(b.x,b.y); await page.waitForTimeout(4000); await grab('34-staff-hours'); }
    else say('  [34] no hours control inside the staff dialog');
  }catch(e){ say('  [34] '+String(e).slice(0,120)); }
  await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(1500);
  // ---- 3. Locations -> Heavy Duty -> business hours ----
  await page.goto(APP+'/administration/locations',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(12000); await grab('35-locations-list');
  await clickRowContaining('Staging Heavy Duty','36',/^$/); await grab('36-location-dialog');
  fs.writeFileSync(OUT+'/dialogs-dump.json',JSON.stringify({surfaces:S,read_at_utc:new Date().toISOString()},null,1));
  fs.writeFileSync(OUT+'/dialogs.log',log.join('\n'));
  say('CAPTURED-DLG: '+Object.keys(S).join(', '));
  await browser.close();
})();
