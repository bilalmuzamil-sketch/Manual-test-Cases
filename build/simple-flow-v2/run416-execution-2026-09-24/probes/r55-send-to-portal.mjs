// The QA lead found it: "Send" in the requirement is the product's "Send to Portal", and it is an
// ICON button whose label lives in its tooltip. My header scan read innerText, which for an icon
// button returns the ligature NAME ("how_to_reg"), not the label - so a control I had actually
// captured and logged looked like something unrelated, and I called Send absent.
// He also says it is only ACTIVE while a line shows "Needs Approval" (i.e. Authorization required).
// Read every header control by TITLE / ARIA-LABEL as well as text, and check its enabled state
// against whether the work order has a line awaiting approval.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const R={};
const readHeader=async()=>await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width&&r.height;};
  const hdrRow=[...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||''));
  const cut=hdrRow?hdrRow.getBoundingClientRect().top:260;
  const ctrls=[...document.querySelectorAll('button,.q-btn')].filter(e=>vis(e)&&e.getBoundingClientRect().top<cut)
    .map(e=>{const r=e.getBoundingClientRect();
      // an icon button's LABEL is in the tooltip / aria-label, never in its text
      const tip=e.querySelector('.q-tooltip');
      return { text:(e.innerText||'').replace(/\s+/g,' ').trim(),
        label: e.getAttribute('aria-label')||e.getAttribute('title')||(tip?(tip.textContent||'').trim():'')||null,
        icon:[...e.querySelectorAll('.q-icon,i')].map(i=>(i.textContent||'').trim()).filter(Boolean).join(','),
        disabled:e.disabled===true||e.getAttribute('aria-disabled')==='true'||/disabled/.test(e.className||''),
        x:Math.round(r.x), y:Math.round(r.y) };})
    .filter(b=>(b.text||b.label||b.icon) && !/^(ShopHub|Work Orders|Schedule|Customers|Parts|Reports|timer|notifications|Trucks|Truck)/.test(b.text||''))
    .sort((a,b)=>a.y-b.y||a.x-b.x);
  return {controls:ctrls, sendWord:/Send to Portal|\bSend\b/.test(document.body.innerText)};});
const lines=async()=>await page.evaluate(()=>[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean)
  .map(id=>{const r=document.querySelector('tr.line-row-'+id);
    return {id,badges:[...r.querySelectorAll('.q-badge')].map(b=>(b.innerText||'').trim())};}));

for (const [tag,id] of [['the work order you sent','f238353d-b383-49f8-9937-e06da106ebab'],
                        ['S2-908 (has a line awaiting approval)','068f9856-9d28-4500-a3dd-dd6d7aafb15a']]) {
  await openWo(page,id); await page.waitForTimeout(9000);
  const ls=await lines(); const h=await readHeader();
  const needsApproval=ls.some(l=>l.badges.some(b=>/Needs Approval/i.test(b)));
  console.log('\n######',tag);
  console.log('  lines:',JSON.stringify(ls.map(l=>l.badges.join('+'))),'| a line is awaiting approval:',needsApproval);
  console.log('  header controls (text | label | icon | state):');
  for(const c of h.controls) console.log('     ',JSON.stringify(c.text).padEnd(26),'|',JSON.stringify(c.label).padEnd(20),'|',c.icon.padEnd(12),'|',c.disabled?'DISABLED':'enabled');
  // hover every icon-only control to make its tooltip render, then read it
  const tips=[];
  for(const c of h.controls.filter(x=>!x.text||/^[a-z_]+$/.test(x.text))){
    await page.mouse.move(c.x+14,c.y+14); await page.waitForTimeout(1600);
    const t=await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(e=>e.getBoundingClientRect().width)
      .map(e=>(e.textContent||'').trim()).filter(Boolean));
    if(t.length) tips.push({icon:c.icon||c.text, tooltip:t.join(' | '), disabled:c.disabled});
  }
  console.log('  tooltips on the icon buttons:',JSON.stringify(tips));
  R[tag]={lines:ls.map(l=>l.badges.join('+')), needsApproval, controls:h.controls, tips, sendWord:h.sendWord};
  await page.screenshot({path:`${EV}/p7-${tag.replace(/\W+/g,'-').slice(0,28)}.png`,clip:{x:290,y:50,width:1390,height:180}}).catch(()=>{});
}
fs.writeFileSync(`${EV}/p7-send-to-portal.json`,JSON.stringify(R,null,1));
await browser.close();
