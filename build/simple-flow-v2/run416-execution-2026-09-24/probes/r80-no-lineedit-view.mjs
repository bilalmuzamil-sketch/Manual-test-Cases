// C44574 - a user without Work Order Lines: Create & Edit sees NO tick boxes and NO bar.
// Assign the role that has that permission off, then look as that person.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WHO=process.env.AS_ADMIN==='1';
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
if(WHO){
  const { setRoleFor } = await import('../seed/lib-role.mjs');
  for(const from of ['Technician','ZZAUTOTEST Receive Later','ZZAUTOTEST Lines Read Only','Admin']){
    const r=await setRoleFor(page,'bilal.muzamil+serviceadvisorlimitedview@shopview.com',from,'ZZAUTOTEST Lines Read Only');
    console.log('assigning via',from,'->',r); if(!/not listed/.test(r)) break; }
  await browser.close(); process.exit(0);
}
const pr=await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
try{const j=JSON.parse(await pr.text()); R.perms=j.data?.fe_permissions||j.data||j;}catch{}
R.hasLineEdit=(R.perms||[]).includes('workOrderLinesCreateAndEdit');
console.log('permissions:',(R.perms||[]).length,'| can create and edit lines:',R.hasLineEdit);
const call=async p=>{const q=await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  const t=await q.text();let j=null;try{j=JSON.parse(t);}catch{}return j;};
const wos=(await call('/api/work-orders?pagination%5BrowsPerPage%5D=40&pagination%5Bpage%5D=1&search=&showMyWorkOrders=0'))?.data?.work_orders||[];
for(const w of wos.slice(0,6)){
  await openWo(page,w.id); await page.waitForTimeout(7000);
  const st=await page.evaluate(()=>{
    const onWO=!!([...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||'')));
    if(!onWO)return {onWO:false};
    const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    return {onWO:true,
      lineCount:[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean).length,
      tickBoxes:[...document.querySelectorAll('[data-test-id^="line_checkbox"],[data-test-id="checkbox_select_all_lines"]')].length,
      visibleTicks:[...document.querySelectorAll('.q-checkbox')].filter(vis).length,
      newLine:/New Line/.test(document.body.innerText),
      addPart:/Add Part/.test(document.body.innerText),
      lineButtons:[...document.querySelectorAll('tr[class*="line-row-"] button,tr[class*="line-row-"] .q-btn')].filter(vis)
        .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,10)};});
  if(!st.onWO) continue;
  R.wo=w.work_order_number; R.view=st;
  console.log('\non a work order with',st.lineCount,'lines:');
  console.log('   tick boxes in the markup :',st.tickBoxes);
  console.log('   tick boxes on screen     :',st.visibleTicks);
  console.log('   "New Line" offered       :',st.newLine,'| "Add Part" offered:',st.addPart);
  console.log('   controls on the line rows:',JSON.stringify(st.lineButtons));
  // hover a line - the tick box only appears on hover for a permitted user
  const id=await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean)[0]);
  if(id){ const tr=page.locator('tr.line-row-'+id).first();
    await tr.hover().catch(()=>{}); await page.waitForTimeout(1500);
    R.onHover=await page.evaluate((lid)=>{const row=document.querySelector('tr.line-row-'+lid);
      return {ticks:[...row.querySelectorAll('.q-checkbox,[type=checkbox]')].filter(e=>e.getBoundingClientRect().width>2).length,
        testIds:[...row.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(x=>/check/i.test(x))};},id);
    console.log('   with the row hovered     :',JSON.stringify(R.onHover));
    // try to raise the bar anyway
    const cb=page.locator(`[data-test-id="line_checkbox_${id}"]`);
    if(await cb.count()){ await cb.first().click({timeout:6000}).catch(()=>{}); await page.waitForTimeout(2500); }
    R.bar=await page.evaluate(()=>{const b=document.querySelector('.bulk-action-bar'); return b?(b.innerText||'').replace(/\s+/g,' ').trim():null;});
    console.log('   the bar after trying to select:',JSON.stringify(R.bar)); }
  await page.screenshot({path:`${EV}/r80-no-lineedit.png`,fullPage:true}).catch(()=>{});
  break;
}
fs.writeFileSync(`${EV}/r80-no-lineedit.json`,JSON.stringify(R,null,1));
await browser.close();
