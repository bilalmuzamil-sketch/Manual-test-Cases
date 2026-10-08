import {op} from './lib.mjs'; import fs from 'fs';
const s=await op({dpr:1,record:'/tmp/qa10142p/rec'}); const p=s.page; const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
await P('/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
const mk=await s.marker(); const A=JSON.parse(fs.readFileSync('prod/wo-A.json')), B=JSON.parse(fs.readFileSync('prod/wo-B.json'));
await P('/api/organizations/invoice-settings/change-design',{documentDesign:'modern'});
const log=[];
const adjRows=async(pg)=>pg.evaluate(()=>{const t=document.body.innerText; const i=t.indexOf('Adjustments'); const j=t.indexOf('Subtotal',i); return i<0?'':t.slice(i+11,j).trim().split('\n').map(x=>x.trim()).filter(Boolean);});
const pointText=async(pg,txt)=>{ const loc=pg.getByText(txt,{exact:true}); const n=await loc.count(); for(let i=n-1;i>=0;i--){ const l=loc.nth(i); if(await l.isVisible()){ await l.scrollIntoViewIfNeeded(); await pg.waitForTimeout(600); const b=await l.boundingBox(); if(b){ await pg.mouse.move(Math.max(5,b.x-24),b.y+b.height/2,{steps:20}); return true; } } } return false; };
const pointTextOld=async(pg,txt)=>{ const r=await pg.evaluate(t=>{ const els=[...document.querySelectorAll('body *')].filter(e=>e.children.length===0&&e.textContent.trim()===t&&e.getBoundingClientRect().width>0); const e=els[0]; if(!e) return null; e.scrollIntoView({block:'center'}); const b=e.getBoundingClientRect(); return {x:b.left,y:b.top+b.height/2};},txt); if(!r) return false; await pg.waitForTimeout(500);
  const b=await pg.evaluate(t=>{const e=[...document.querySelectorAll('body *')].find(e=>e.children.length===0&&e.textContent.trim()===t&&e.getBoundingClientRect().width>0); const b=e.getBoundingClientRect(); return {x:b.left,y:b.top+b.height/2};},txt); await pg.mouse.move(Math.max(5,b.x-24),b.y,{steps:20}); return true; };
const pair=rows=>{const o=[]; for(let i=0;i+1<rows.length;i+=2) o.push(rows[i]+' '+rows[i+1]); return o;};
await s.go('/workorders'); await p.waitForTimeout(1500);
await s.caption(`SV-10142 - production app.shopview.com, build ${mk.version}, 8 Oct 2026. Document design set to the new layout for this test.`,{hold:4000});
for (const [W,tag] of [[A,'S2-965'],[B,'S2-966']]){
  await s.caption(`Opening work order ${tag} (fees and discounts on labor lines, part lines and the whole work order)`,{hold:2500});
  await s.caption('',{hold:0}); await s.go('/workorders/'+W.wo+'/lines'); await s.caption(`Work order ${tag}: opening the Finance tab`,{hold:1500}); await p.waitForTimeout(3000);
  const ft=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).find(x=>/finance/i.test(x)&&/tab/i.test(x)));
  if(ft){ try{ await s.glideClick(ft);}catch(e){ await s.go('/workorders/'+W.wo+'/finance'); } } else await s.go('/workorders/'+W.wo+'/finance');
  await p.waitForTimeout(4000);
  await pointText(p,'Adjustments'); const rows=pair(await adjRows(p)); log.push([tag,'finance',rows]);
  await s.caption(`${tag} invoice, Adjustments block: ${rows.join(' / ')}`,{hold:9000});
}
// portal
await s.caption('Now the customer portal: profile menu, Customer Portal',{hold:2500});
let b=await s.box('profile_menu_button'); await p.mouse.move(b.x,b.y,{steps:18}); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1200);
b=await s.box('profile_menu_customer_portal'); await p.mouse.move(b.x,b.y,{steps:18}); await p.mouse.click(b.x,b.y); await p.waitForTimeout(12000);
const pop=s.ctx.pages().at(-1); if(pop!==p) await pop.close();
for (const [num,tag] of [['965','S2-965'],['966','S2-966'],['79','P2-79']]){
  await s.caption('',{hold:0}); await p.goto('https://portal.shopview.com/invoices',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(3500); await s.caption(`Customer portal, Invoices: searching for ${tag}`,{hold:1200});
  const inp=p.locator('input[placeholder*="Search by invoice"]'); const ib=await inp.boundingBox(); await p.mouse.move(ib.x+40,ib.y+ib.height/2,{steps:18});
  await inp.click(); await inp.pressSequentially(num,{delay:120}); await p.waitForTimeout(3000);
  const row=p.locator('tr',{hasText:tag}).first(); const rb=await row.boundingBox(); await p.mouse.move(rb.x+rb.width/2,rb.y+rb.height/2,{steps:18}); await row.click(); await p.waitForTimeout(5000);
  await pointText(p,'Adjustments'); const rows=pair(await adjRows(p)); log.push([tag,'portal',rows]);
  await s.caption(`Customer portal, invoice ${tag}: ${rows.join(' / ')}`,{hold:9000});
}
// legacy
await s.caption('',{hold:0}); await s.go('/workorders'); await s.caption('Back in the app: switching the document design back to Legacy (the setting production had before this test)',{hold:3000}); await p.waitForTimeout(1500);
await P('/api/organizations/invoice-settings/change-design',{documentDesign:'legacy'});
const d=await s.api('/api/organizations/invoice-settings/view'); const design=JSON.stringify(d.json).match(/documentDesign":"(\w+)/)?.[1];
await s.go('/workorders/'+A.wo+'/finance'); await s.caption('Work order S2-965 again, Finance tab, Legacy layout',{hold:4000});
await pointText(p,'Adjustments'); const lrows=pair(await adjRows(p)); log.push(['S2-965','legacy-finance',lrows,design]);
await s.caption(`Design back on Legacy (read back: ${design}). Legacy layout unchanged: ${lrows.join(' / ')}`,{hold:9000});
await s.caption('',{hold:0});
fs.writeFileSync('rec-log.json',JSON.stringify({marker:mk,log},null,1));
const r=await s.close(); console.log(JSON.stringify(r)); console.log(JSON.stringify(log).slice(0,1500));
