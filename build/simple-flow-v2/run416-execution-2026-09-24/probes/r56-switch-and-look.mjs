// The work order he linked never loaded: my session is on "Trucks Hill 2" and his screenshot shows
// "Truck Hill 1", so opening it redirected me to the work-order LIST - and I read the list's toolbar
// as if it were the work order's header. (That is why the controls came back as Create Work Order,
// Search, Column Selection.) Switch workplace first, then look.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const WO='f238353d-b383-49f8-9937-e06da106ebab';
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(25000);
const R={};
const api=async(p,init)=>{const r=await ctx.request.fetch(`https://${APIH}${p}`,{headers:{Accept:'application/json','Content-Type':'application/json'},ignoreHTTPSErrors:true,...(init||{})});
  const t=await r.text();let j=null;try{j=JSON.parse(t);}catch{} return {s:r.status(),j};};
const wp=await api('/api/staff/my-workplaces');
// the shape of this reply is not what I assumed - find the array wherever it sits, rather than
// guessing a path and crashing on it
const findArr=(o,d=0)=>{ if(Array.isArray(o)&&o.length&&o[0]&&typeof o[0]==='object'&&('name' in o[0])) return o;
  if(o&&typeof o==='object'&&d<4){ for(const k of Object.keys(o)){ const r=findArr(o[k],d+1); if(r) return r; } } return null; };
const list=findArr(wp.j)||[];
if(!list.length) console.log('raw reply:', JSON.stringify(wp.j).slice(0,400));
R.workplaces=list.map(w=>({id:w.id,name:w.name}));
console.log('workplaces I can use:',JSON.stringify(R.workplaces));
const target=list.find(w=>/truck\s*hill\s*1/i.test(w.name||''));
if(!target){ console.log('no Truck Hill 1 in my list'); }
else {
  const sw=await api('/api/iam/change-location',{method:'POST',data:JSON.stringify({workplace_id:target.id})});
  console.log('switched to',target.name,'->',sw.s);
  await page.reload({waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
}
await openWo(page,WO); await page.waitForTimeout(10000);
R.url=page.url();
console.log('\non:',R.url);
const st=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width&&r.height;};
  const hdrRow=[...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||''));
  const cut=hdrRow?hdrRow.getBoundingClientRect().top:260;
  return { onAWorkOrder: !!hdrRow,
    badges:[...document.querySelectorAll('.q-badge')].filter(vis).map(b=>(b.innerText||'').trim()).slice(0,8),
    lines:[...new Set([...document.querySelectorAll('tr[class*="line-row-"]')].map(t=>(t.className.match(/line-row-([0-9a-f-]+)/)||[])[1]))].filter(Boolean).length,
    lineBadges:[...document.querySelectorAll('tr[class*="line-row-"] .q-badge')].map(b=>(b.innerText||'').trim()),
    controls:[...document.querySelectorAll('button,.q-btn')].filter(e=>vis(e)&&e.getBoundingClientRect().top<cut)
      .map(e=>{const r=e.getBoundingClientRect();
        return {text:(e.innerText||'').replace(/\s+/g,' ').trim(),
          label:e.getAttribute('aria-label')||e.getAttribute('title')||null,
          icon:[...e.querySelectorAll('.q-icon,i')].map(i=>(i.textContent||'').trim()).filter(Boolean).join(','),
          disabled:e.disabled===true||e.getAttribute('aria-disabled')==='true'||/disabled/.test(e.className||''),
          x:Math.round(r.x),y:Math.round(r.y)};})
      .filter(b=>(b.text||b.icon) && !/^(ShopHub|Work Orders|Schedule|Customers|Parts|Reports|timer|notifications|Truck)/.test(b.text||'')),
    sendWord:/Send to Portal/i.test(document.body.innerText) };});
R.state=st;
console.log('  am I on a work order:',st.onAWorkOrder,'| badges:',JSON.stringify(st.badges));
console.log('  lines:',st.lines,'| their statuses:',JSON.stringify(st.lineBadges));
console.log('  header controls:');
for(const c of st.controls) console.log('     ',JSON.stringify(c.text).padEnd(24),'| label',JSON.stringify(c.label).padEnd(18),'| icon',(c.icon||'-').padEnd(12),'|',c.disabled?'DISABLED':'enabled');
console.log('  "Send to Portal" in the page text:',st.sendWord);
// hover every icon control and read its tooltip
const tips=[];
for(const c of st.controls){
  await page.mouse.move(c.x+14,c.y+14); await page.waitForTimeout(1500);
  const t=await page.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(e=>e.getBoundingClientRect().width).map(e=>(e.textContent||'').trim()).filter(Boolean));
  if(t.length) tips.push({control:c.text||c.icon, tooltip:t.join(' | '), disabled:c.disabled});
}
R.tips=tips;
console.log('  tooltips:',JSON.stringify(tips));
await page.screenshot({path:`${EV}/p7b-his-workorder.png`,fullPage:false}).catch(()=>{});
await page.screenshot({path:`${EV}/p7b-his-workorder-header.png`,clip:{x:290,y:50,width:1390,height:200}}).catch(()=>{});
fs.writeFileSync(`${EV}/p7b-send-to-portal.json`,JSON.stringify(R,null,1));
await browser.close();
