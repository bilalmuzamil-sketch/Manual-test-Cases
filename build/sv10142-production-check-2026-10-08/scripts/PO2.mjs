import {op,j} from './lib.mjs'; import fs from 'fs';
const s=await op(); const p=s.page; const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
await P('/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
await P('/api/organizations/invoice-settings/change-design',{documentDesign:'modern'}); console.log('design',(await s.api('/api/organizations/invoice-settings/view')).json?.data?.documentDesign);
await s.go('/workorders'); let b=await s.box('profile_menu_button'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1200); b=await s.box('profile_menu_customer_portal'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(12000);
const pp=s.ctx.pages().at(-1); await pp.setViewportSize({width:1600,height:1000});
const geo={};
for(const [tag,q] of [['A','S2-965'],['B','S2-966'],['PS','P2-79']]){
  await pp.goto('https://portal.shopview.com/invoices',{waitUntil:'domcontentloaded'}); await pp.waitForTimeout(3500);
  await pp.locator('input[placeholder*="Search by invoice"]').fill(q.split('-')[1]); await pp.waitForTimeout(3000);
  await pp.locator('tr',{hasText:q}).first().click(); await pp.waitForTimeout(6000);
  const txt=await pp.evaluate(()=>document.body.innerText); const i=txt.indexOf('Adjustments'); console.log('==',tag,q,pp.url().split('/').pop()); console.log('  '+txt.slice(i,i+520).replace(/\n/g,' | '));
  // geometry of the Adjustments block for exhibits
  geo[tag]=await pp.evaluate(()=>{ const el=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&e.textContent.trim()==='Adjustments'); if(!el) return null; el.scrollIntoView({block:'center'}); const r=el.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; });
  await pp.waitForTimeout(800);
  geo[tag+'_after']=await pp.evaluate(()=>{ const el=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&e.textContent.trim()==='Adjustments'); const r=el.getBoundingClientRect(); const rows=[]; let n=el.parentElement; for(let k=0;k<4&&n;k++){ n=n.parentElement; } const bx=(n||el).getBoundingClientRect(); return {head:[r.x,r.y,r.width,r.height].map(Math.round),block:[bx.x,bx.y,bx.width,bx.height].map(Math.round)}; });
  await pp.screenshot({path:`portal-${tag}.png`}); }
await pp.goto('https://portal.shopview.com/service-requests',{waitUntil:'domcontentloaded'}).catch(()=>{}); await pp.waitForTimeout(4000); console.log('SR page',pp.url(), (await pp.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,500));
fs.writeFileSync('portal-geo.json',JSON.stringify(geo,null,1));
await P('/api/organizations/invoice-settings/change-design',{documentDesign:'legacy'}); console.log('design restored',(await s.api('/api/organizations/invoice-settings/view')).json?.data?.documentDesign);
await s.close();
