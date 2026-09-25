// What the default Technician role actually grants (so the C44565 item-3 finding names the real
// permission set), and put back the two lines the technician completed during the checks.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WHO=process.env.WHO||'perms';
if (WHO==='perms') {
  const {browser,ctx,APIH}=await bootProdLogin('/workorders',{settle:11000});
  const r=await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  const j=JSON.parse(await r.text());
  const p=j.data?.fe_permissions||j.data||j;
  console.log('default Technician role grants', (p||[]).length, 'permissions:');
  console.log(JSON.stringify(p,null,1));
  fs.writeFileSync(`${EV}/p3p-technician-default-perms.json`,JSON.stringify(p,null,1));
  await browser.close();
} else {
  const {browser,page}=await bootProdLogin('/workorders',{settle:11000,viewport:{width:1680,height:1000}});
  page.setDefaultTimeout(25000);
  await openWo(page,'068f9856-9d28-4500-a3dd-dd6d7aafb15a'); await page.waitForTimeout(8000);
  const ls=await page.evaluate(()=>{const s=new Set(),o=[];
    for(const tr of document.querySelectorAll('tr[class*="line-row-"]')){const i=(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1];
      if(!i||s.has(i))continue;s.add(i);o.push({id:i,badges:[...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim())});}return o;});
  console.log('lines now:',JSON.stringify(ls.map(l=>l.badges.join('+'))));
  for (const l of ls.filter(x=>x.badges.some(b=>/^Complete$/i.test(b)))) {
    const tr=page.locator(`tr.line-row-${l.id}`).first();
    await tr.scrollIntoViewIfNeeded().catch(()=>{}); await tr.hover().catch(()=>{}); await page.waitForTimeout(1100);
    const spot=await page.evaluate((lid)=>{const row=document.querySelector(`tr.line-row-${lid}`); if(!row)return null;
      const rb=row.getBoundingClientRect(); const c=[];
      document.querySelectorAll('button,.q-btn,i,.q-icon').forEach(b=>{if(!/more_vert/.test((b.innerText||b.textContent||'').trim()))return;
        const r=b.getBoundingClientRect(); if(!r.width||!r.height)return; const cy=r.y+r.height/2;
        if(cy>=rb.top-2&&cy<=rb.bottom+2)c.push({x:Math.round(r.x+r.width/2),y:Math.round(cy)});});
      c.sort((a,b)=>a.x-b.x);return c[0]||null;},l.id);
    if(!spot) continue;
    await page.mouse.click(spot.x,spot.y); await page.waitForTimeout(1800);
    const done=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].filter(x=>x.getBoundingClientRect().width>20).pop();
      if(!m)return 'no menu'; const i=[...m.querySelectorAll('.q-item')].find(x=>/^Uncomplete/i.test((x.innerText||'').trim()));
      if(!i)return 'no Uncomplete'; i.click(); return 'pressed Uncomplete';});
    console.log('  ',l.badges.join('+'),'->',done);
    await page.waitForTimeout(4000);
    await page.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width)[0]; if(!d)return;
      const b=[...d.querySelectorAll('button,.q-btn')].find(x=>/^(Uncomplete|Yes|Confirm|OK|Continue)$/i.test((x.innerText||'').trim()));if(b)b.click();});
    await page.waitForTimeout(4000);
  }
  await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
  const after=await page.evaluate(()=>{const s=new Set(),o=[];
    for(const tr of document.querySelectorAll('tr[class*="line-row-"]')){const i=(tr.className.match(/line-row-([0-9a-f-]+)/)||[])[1];
      if(!i||s.has(i))continue;s.add(i);o.push([...tr.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim()).join('+'));}return o;});
  console.log('lines restored to:',JSON.stringify(after));
  fs.writeFileSync(`${EV}/p3p-restore.json`,JSON.stringify({after},null,1));
  await browser.close();
}
