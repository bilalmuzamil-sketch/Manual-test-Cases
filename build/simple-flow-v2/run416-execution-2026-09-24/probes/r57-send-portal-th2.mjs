// The work order he gave for Trucks Hill 2, where "Send to Portal" is visible. Read every header
// control by TEXT, ARIA-LABEL, TITLE and its rendered TOOLTIP - an icon button's label is never in
// its text, which is exactly how I missed this control the first time.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='f86430ce-7e98-407a-baad-86df0e569aca';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const R={};
await openWo(page,WO); await page.waitForTimeout(10000);
R.url=page.url();
const st=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>4&&r.height>4;};
  const hdrRow=[...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||''));
  const cut=hdrRow?hdrRow.getBoundingClientRect().top:260;
  return { onAWorkOrder:!!hdrRow, cut:Math.round(cut),
    woBadges:[...document.querySelectorAll('.q-badge')].filter(vis).map(b=>(b.innerText||'').trim()).slice(0,6),
    lineBadges:[...document.querySelectorAll('tr[class*="line-row-"] .q-badge')].map(b=>(b.innerText||'').trim()),
    sendInText:/Send to Portal/i.test(document.body.innerText),
    controls:[...document.querySelectorAll('button,.q-btn')].filter(e=>vis(e)&&e.getBoundingClientRect().top<cut)
      .map(e=>{const r=e.getBoundingClientRect();
        return {text:(e.innerText||'').replace(/\s+/g,' ').trim(),
          label:e.getAttribute('aria-label')||e.getAttribute('title')||null,
          tip:(e.querySelector('.q-tooltip')||{}).textContent?.trim()||null,
          icon:[...e.querySelectorAll('.q-icon,i')].map(i=>(i.textContent||'').trim()).filter(Boolean).join(','),
          disabled:e.disabled===true||e.getAttribute('aria-disabled')==='true'||/disabled/.test(e.className||''),
          x:Math.round(r.x),y:Math.round(r.y)};})
      .filter(b=>(b.text||b.icon||b.label) && !/^(ShopHub|Work Orders|Schedule|Customers|Parts|Reports|timer|notifications|Truck)/.test(b.text||'')) };});
R.state=st;
console.log('on:',R.url);
console.log('am I on the work order:',st.onAWorkOrder,'| work order badges:',JSON.stringify(st.woBadges));
console.log('line statuses:',JSON.stringify(st.lineBadges));
console.log('"Send to Portal" appears in the page text:',st.sendInText);
console.log('\nheader controls:');
for(const c of st.controls)
  console.log('  ',JSON.stringify(c.text).padEnd(26),'| label',JSON.stringify(c.label||c.tip).padEnd(22),'| icon',(c.icon||'-').padEnd(14),'|',c.disabled?'DISABLED':'enabled');
// hover each one to force its tooltip to render
R.tips=[];
for(const c of st.controls){
  await page.mouse.move(c.x+12,c.y+12); await page.waitForTimeout(1500);
  const t=await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.textContent||'').trim()).filter(Boolean));
  if(t.length){ R.tips.push({control:c.text||c.icon,tooltip:t.join(' | '),disabled:c.disabled});
    console.log('   hovering',JSON.stringify(c.text||c.icon),'->',JSON.stringify(t.join(' | ')), c.disabled?'(DISABLED)':'(enabled)'); }
}
await page.screenshot({path:`${EV}/p7c-th2-header.png`,clip:{x:290,y:50,width:1390,height:210}}).catch(()=>{});
await page.screenshot({path:`${EV}/p7c-th2-full.png`,fullPage:false}).catch(()=>{});
fs.writeFileSync(`${EV}/p7c-send-portal.json`,JSON.stringify(R,null,1));
await browser.close();
