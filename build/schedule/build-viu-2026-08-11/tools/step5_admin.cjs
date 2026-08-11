const {open,DUMP,APP}=require('./harvest.cjs');
const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-11/evidence';
const S={};
(async()=>{
  const {browser,page}=await open();
  const grab=async n=>{ try{ S[n]=await page.evaluate(DUMP); await page.screenshot({path:`${OUT}/surface-${n}.png`});
    console.log(`[${n}] ${S[n].url} texts=${S[n].texts.length}`);}catch(e){console.log(`[${n}] ERR ${e}`);} };
  const clickText=async(t,tag)=>{ try{
    const box=await page.evaluate(label=>{
      const els=[...document.querySelectorAll('a,div,span,button')].filter(e=>(e.textContent||'').trim()===label && e.children.length<=1);
      if(!els.length) return null; const r=els[0].getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},t);
    if(!box){ console.log(`  [${tag}] nav item "${t}" not found`); return false; }
    await page.mouse.click(box.x,box.y); await page.waitForTimeout(7000); return true;
  }catch(e){ console.log(`  [${tag}] ${e}`); return false; } };
  await page.goto(APP+'/administration/settings',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(13000);
  // real routes, reached by clicking the admin nav
  if(await clickText('Roles & Permissions','23')) await grab('23-roles-permissions');
  if(await clickText('Staff','24')) await grab('24-staff');
  // open the first technician's edit dialog (READ ONLY - nothing saved)
  try{
    const row=await page.evaluate(()=>{
      const els=[...document.querySelectorAll('tr,[role=row]')].filter(e=>/@/.test(e.textContent||''));
      // deliberately skip admin@shopview.com - editing it kills the session
      const t=els.find(e=>!/admin@shopview\.com/.test(e.textContent||''));
      if(!t) return null; const r=t.getBoundingClientRect(); return {x:r.x+r.width*0.5,y:r.y+r.height/2,who:(t.textContent||'').trim().slice(0,60)};
    });
    if(row){ console.log('  opening staff row (NOT admin):',row.who);
      await page.mouse.click(row.x,row.y); await page.waitForTimeout(6000); await grab('25-staff-edit-dialog'); }
  }catch(e){ console.log('[25] '+e); }
  await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(1500);
  // Locations -> business hours for the shop
  await page.goto(APP+'/administration/locations',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(11000);
  try{
    const loc=await page.evaluate(()=>{
      const els=[...document.querySelectorAll('tr,[role=row],div')].filter(e=>/Staging Heavy Duty - 9919/.test(e.textContent||'')&&e.children.length<=6);
      if(!els.length) return null; const r=els[els.length-1].getBoundingClientRect(); return {x:r.x+r.width*0.3,y:r.y+r.height/2};
    });
    if(loc){ await page.mouse.click(loc.x,loc.y); await page.waitForTimeout(7000); await grab('26-location-detail'); }
  }catch(e){ console.log('[26] '+e); }
  fs.writeFileSync(OUT+'/surfaces3-dump.json',JSON.stringify({surfaces:S,read_at_utc:new Date().toISOString()},null,1));
  console.log('CAPTURED3:',Object.keys(S).join(', '));
  await browser.close();
})();
