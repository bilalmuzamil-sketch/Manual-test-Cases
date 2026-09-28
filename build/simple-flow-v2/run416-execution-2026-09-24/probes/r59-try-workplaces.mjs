// Try each workplace in turn and see which one actually renders his work order. Stop assuming.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='f86430ce-7e98-407a-baad-86df0e569aca';
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:12000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const call=async(p,init)=>{const r=await ctx.request.fetch(`https://${APIH}${p}`,
  {headers:{Accept:'application/json','Content-Type':'application/json'},ignoreHTTPSErrors:true,...(init||{})});
  const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch{} return {s:r.status(),j};};
const wps=(await call('/api/staff/my-workplaces')).j?.data?.collection||[];
console.log('workplaces:',JSON.stringify(wps.map(w=>w.name)));
const R={tried:[]};
for (const w of wps) {
  const sw=await call('/api/iam/change-location',{method:'POST',data:JSON.stringify({workplace_id:w.id})});
  await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(5000);
  await openWo(page,WO); await page.waitForTimeout(7000);
  const on=await page.evaluate(()=>({url:location.href,
    onWO:!!([...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||''))),
    sendText:/Send to Portal/i.test(document.body.innerText)}));
  console.log('  ',w.name.padEnd(16),'switch',sw.s,'->',on.onWO?'THE WORK ORDER LOADED':'redirected to '+on.url.replace('https://app.shopview.com',''),
              on.sendText?'| "Send to Portal" present':'');
  R.tried.push({workplace:w.name,...on});
  if(on.onWO){
    R.found=w.name;
    const st=await page.evaluate(()=>{
      const vis=e=>{const r=e.getBoundingClientRect();return r.width>4&&r.height>4;};
      const hdrRow=[...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||''));
      const cut=hdrRow.getBoundingClientRect().top;
      return { woBadges:[...document.querySelectorAll('.q-badge')].filter(vis).map(b=>(b.innerText||'').trim()).slice(0,6),
        lineBadges:[...document.querySelectorAll('tr[class*="line-row-"] .q-badge')].map(b=>(b.innerText||'').trim()),
        controls:[...document.querySelectorAll('button,.q-btn')].filter(e=>vis(e)&&e.getBoundingClientRect().top<cut)
          .map(e=>{const r=e.getBoundingClientRect();
            return {text:(e.innerText||'').replace(/\s+/g,' ').trim(),
              label:e.getAttribute('aria-label')||e.getAttribute('title')||null,
              icon:[...e.querySelectorAll('.q-icon,i')].map(i=>(i.textContent||'').trim()).filter(Boolean).join(','),
              disabled:e.disabled===true||e.getAttribute('aria-disabled')==='true'||/disabled/.test(e.className||''),
              x:Math.round(r.x),y:Math.round(r.y)};})
          .filter(b=>(b.text||b.icon||b.label)&&!/^(ShopHub|Work Orders|Schedule|Customers|Parts|Reports|timer|notifications|Truck)/.test(b.text||'')) };});
    R.state=st;
    console.log('\n   work order badges:',JSON.stringify(st.woBadges));
    console.log('   line statuses    :',JSON.stringify(st.lineBadges));
    console.log('   header controls:');
    for(const c of st.controls) console.log('     ',JSON.stringify(c.text).padEnd(24),'| label',JSON.stringify(c.label).padEnd(20),'| icon',(c.icon||'-').padEnd(13),'|',c.disabled?'DISABLED':'enabled');
    R.tips=[];
    for(const c of st.controls){ await page.mouse.move(c.x+12,c.y+12); await page.waitForTimeout(1400);
      const t=await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.textContent||'').trim()).filter(Boolean));
      if(t.length){R.tips.push({control:c.text||c.icon,tooltip:t.join(' | '),disabled:c.disabled});
        console.log('     hover',JSON.stringify(c.text||c.icon),'->',JSON.stringify(t.join(' | ')),c.disabled?'(DISABLED)':'(enabled)');}}
    await page.screenshot({path:`${EV}/p7e-found-header.png`,clip:{x:290,y:50,width:1390,height:210}}).catch(()=>{});
    await page.screenshot({path:`${EV}/p7e-found-full.png`}).catch(()=>{});
    break;
  }
}
fs.writeFileSync(`${EV}/p7e-workplaces.json`,JSON.stringify(R,null,1));
await browser.close();
