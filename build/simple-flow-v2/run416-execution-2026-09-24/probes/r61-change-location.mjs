// My API switch left the session on "Inventory 2" and then 500'd on every further call. The screen
// has the real control: the profile menu carries "Change Location: <current>", which opens the list.
// Use it, get back to Trucks Hill 2, then open his work order.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='f86430ce-7e98-407a-baad-86df0e569aca';
const {browser,page}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const R={};
const menuItems=async()=>await page.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item,.q-dialog .q-item,.q-menu [clickable]')]
  .filter(e=>e.getBoundingClientRect().width).map(e=>{const r=e.getBoundingClientRect();
    return {t:(e.innerText||'').replace(/\s+/g,' ').trim(),x:Math.round(r.x+30),y:Math.round(r.y+r.height/2)};}).filter(o=>o.t));
// open the profile menu
await page.mouse.click(1577,30); await page.waitForTimeout(2500);
let items=await menuItems();
const chg=items.find(i=>/Change Location/i.test(i.t));
console.log('profile menu:',JSON.stringify(items.map(i=>i.t.slice(0,34))));
if(chg){ await page.mouse.click(chg.x,chg.y); await page.waitForTimeout(3500);
  items=await menuItems();
  console.log('after Change Location:',JSON.stringify(items.map(i=>i.t.slice(0,30))));
  const want=items.find(i=>/Trucks Hill 2/i.test(i.t));
  if(want){ await page.mouse.click(want.x,want.y); await page.waitForTimeout(9000);
    console.log('picked Trucks Hill 2'); }
  else console.log('Trucks Hill 2 not offered'); }
R.workplace=await page.evaluate(()=>document.body.innerText.match(/Trucks? Hill \d|Inventory \d|QA \w+|SANKAN|Import Test|For Ryan/)?.[0]||null);
console.log('workplace now:',R.workplace);
await openWo(page,WO); await page.waitForTimeout(9000);
const st=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>4&&r.height>4;};
  const hdrRow=[...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||''));
  if(!hdrRow) return {onWO:false,url:location.href};
  const cut=hdrRow.getBoundingClientRect().top;
  return {onWO:true,url:location.href,
    woBadges:[...document.querySelectorAll('.q-badge')].filter(vis).map(b=>(b.innerText||'').trim()).slice(0,6),
    lineBadges:[...document.querySelectorAll('tr[class*="line-row-"] .q-badge')].map(b=>(b.innerText||'').trim()),
    sendText:/Send to Portal/i.test(document.body.innerText),
    controls:[...document.querySelectorAll('button,.q-btn')].filter(e=>vis(e)&&e.getBoundingClientRect().top<cut)
      .map(e=>{const r=e.getBoundingClientRect();
        return {text:(e.innerText||'').replace(/\s+/g,' ').trim(),
          label:e.getAttribute('aria-label')||e.getAttribute('title')||null,
          icon:[...e.querySelectorAll('.q-icon,i')].map(i=>(i.textContent||'').trim()).filter(Boolean).join(','),
          disabled:e.disabled===true||e.getAttribute('aria-disabled')==='true'||/disabled/.test(e.className||''),
          x:Math.round(r.x),y:Math.round(r.y)};})
      .filter(b=>(b.text||b.icon||b.label)&&!/^(ShopHub|Work Orders|Schedule|Customers|Parts|Reports|timer|notifications|Truck|Inventory|QA|SANKAN|Import|For Ryan)/.test(b.text||''))};});
R.state=st;
console.log('\non a work order:',st.onWO,'|',st.url);
if(st.onWO){
  console.log('  badges:',JSON.stringify(st.woBadges),'| lines:',JSON.stringify(st.lineBadges));
  console.log('  "Send to Portal" in the page text:',st.sendText);
  for(const c of st.controls) console.log('   ',JSON.stringify(c.text).padEnd(22),'| label',JSON.stringify(c.label).padEnd(18),'| icon',(c.icon||'-').padEnd(12),'|',c.disabled?'DISABLED':'enabled');
  R.tips=[];
  for(const c of st.controls){ await page.mouse.move(c.x+12,c.y+12); await page.waitForTimeout(1500);
    const t=await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.textContent||'').trim()).filter(Boolean));
    if(t.length){R.tips.push({control:c.text||c.icon,tooltip:t.join(' | '),disabled:c.disabled});
      console.log('     hover',JSON.stringify(c.text||c.icon),'->',JSON.stringify(t.join(' | ')),c.disabled?'(DISABLED)':'(enabled)');}}
  await page.screenshot({path:`${EV}/p7g-send-to-portal.png`,clip:{x:290,y:50,width:1390,height:210}}).catch(()=>{});
  await page.screenshot({path:`${EV}/p7g-full.png`}).catch(()=>{});
}
fs.writeFileSync(`${EV}/p7g-change-location.json`,JSON.stringify(R,null,1));
await browser.close();
