import {op,j} from './lib.mjs'; import fs from 'fs';
const s=await op(); const p=s.page; const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
await P('/api/iam/change-location',{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'});
await s.go('/workorders'); let b=await s.box('profile_menu_button'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1200); b=await s.box('profile_menu_customer_portal'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(12000);
const pp=s.ctx.pages().at(-1); await pp.setViewportSize({width:1600,height:1000});
await pp.getByText('Service Requests',{exact:true}).first().click(); await pp.waitForTimeout(5000); console.log('SR url',pp.url()); console.log((await pp.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,900));
await pp.screenshot({path:'portal-sr.png'});
// look for estimate wording anywhere in the portal bundle routes
const links=await pp.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')).filter((v,i,a)=>a.indexOf(v)===i)); console.log('links',links.join(' '));
await s.close();
