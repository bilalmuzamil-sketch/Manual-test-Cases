import {sess2} from './lib2.mjs'; const s=await sess2(); const P=s.page; const log=[];
P.on('response',async r=>{const u=r.url(); if(/\/api\//.test(u)&&!/envelope|touch|notif/.test(u)) log.push(r.request().method()+' '+r.status()+' '+u.split('/api')[1].slice(0,100)+' '+(await r.text().catch(()=>'')).slice(0,160));});
await s.go('/administration/locations'); await P.waitForTimeout(2500); log.length=0;
let b=await s.box('button_add_workplace'); await P.mouse.click(b.x,b.y); await s.waitFor('input_name'); await P.waitForTimeout(1500);
b=await s.box('select_country_code'); await P.mouse.click(b.x,b.y); await P.waitForTimeout(1500);
console.log(log.join('\n').slice(0,2000));
console.log('country field html',await P.evaluate(()=>document.querySelector('[data-test-id="select_country_code"]').closest('.q-field').outerHTML.slice(0,400)));
await s.browser.close(); process.exit(0);
