const {open,DUMP,APP}=require('./harvest.cjs');
const fs=require('fs');
const OUT='/home/user/Manual-test-Cases/build/schedule/build-viu-2026-08-11/evidence';
const S={};
(async()=>{
  const {browser,page}=await open();
  const grab=async n=>{ try{ S[n]=await page.evaluate(DUMP); await page.screenshot({path:`${OUT}/surface-${n}.png`});
    console.log(`[${n}] url=${S[n].url} texts=${S[n].texts.length}`);}catch(e){console.log(`[${n}] ERR ${e}`);} };
  const go=async(route,tag,wait=13000)=>{ try{ await page.goto(APP+route,{waitUntil:'domcontentloaded',timeout:120000});
    await page.waitForTimeout(wait); await grab(tag);}catch(e){console.log(`[${tag}] nav ERR ${e}`);} };

  // --- 16: Working Hours / business hours settings (several candidate routes) ---
  for (const [r,t] of [['/administration/settings','16-admin-settings'],
                       ['/administration/working-hours','17-working-hours'],
                       ['/administration/locations','18-locations']]) await go(r,t);
  // --- 19: Custom Roles admin (Reset To Template / Time Clock) ---
  await go('/administration/roles','19-roles');
  // --- back to schedule for the in-page states ---
  await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(14000);
  // --- 20: Filters panel WITH a selection active -> should reveal Clear all ---
  try{
    const f=await page.$('[data-test-id=button_sidebar_filters]');
    const b=await f.boundingBox(); await page.mouse.click(b.x+b.width/2,b.y+b.height/2);
    await page.waitForTimeout(2500);
    // click the first status row in the panel
    const row=await page.evaluate(()=>{
      const cand=[...document.querySelectorAll('*')].filter(e=>{
        const t=(e.textContent||'').trim();
        return /^(Approved|Assigned|Unassigned|In Progress|Declined|Ready for Review)$/.test(t) && e.children.length===0;});
      if(!cand.length) return null; const r=cand[0].getBoundingClientRect();
      return {x:r.x+r.width/2,y:r.y+r.height/2,label:cand[0].textContent.trim()};
    });
    if(row){ await page.mouse.click(row.x,row.y); await page.waitForTimeout(3000);
      console.log('  clicked filter row:',row.label); }
    await grab('20-filters-active');
  }catch(e){ console.log('[20] '+e); }
  // --- 21: expanded WO card chips (All / Unscheduled) + line statuses ---
  try{
    await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
    const card=await page.$('[data-test-id=sidebar_work_order_card]');
    const cb=await card.boundingBox();
    await page.mouse.click(cb.x+cb.width-24,cb.y+24); await page.waitForTimeout(3500);
    await grab('21-card-chips');
  }catch(e){ console.log('[21] '+e); }
  // --- 22: technician search in the sidebar (Andrew Wade / multi-word) ---
  try{
    await page.goto(APP+'/schedule',{waitUntil:'domcontentloaded',timeout:120000});
    await page.waitForTimeout(13000);
    const inp=await page.$('[data-test-id=input_sidebar_search]');
    if(inp){ await inp.click(); await inp.fill('Vuchester'); await page.waitForTimeout(3500); await grab('22-search-vuchester'); }
  }catch(e){ console.log('[22] '+e); }
  fs.writeFileSync(OUT+'/surfaces2-dump.json',JSON.stringify({surfaces:S,read_at_utc:new Date().toISOString()},null,1));
  console.log('CAPTURED2:',Object.keys(S).join(', '));
  await browser.close();
})();
