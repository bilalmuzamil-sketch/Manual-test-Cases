// node pay.mjs <woId> -> Finance tab New Payment: discover dialog; tick the store credit (applied credit) and pay the rest by cash; then re-open invoice menu and hover Reverse. ENV=prod. ../ev/<env>-RC-6..9
import {sess,post} from './common.mjs'; import fs from 'fs';
const E=process.env.ENV==='prod'?'prod':'branch'; const s=await sess({vp:{width:1600,height:900}}); const p=s.page; const wo=process.argv[2]; const R={};
if(E==='prod'){ const ws=(await s.api('/api/staff/my-workplaces')).json.data; const W=(ws.collection||ws).find(w=>/Trucks Hill 2/.test(w.name)); await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone}); }
await s.go('/workorders/'+wo+'/finance'); await p.waitForTimeout(4000);
const nb=p.locator('button').filter({hasText:'New Payment'}).first(); await nb.click(); await p.waitForTimeout(2500);
R.ids=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')+':'+(e.innerText||e.value||'').replace(/\s+/g,' ').slice(0,50)));
console.log('ids',JSON.stringify(R.ids)); await p.screenshot({path:`../ev/${E}-RC-6-new-payment.png`});
const cbs=R.ids.map(x=>x.split(':')[0]).filter(x=>x.startsWith('checkbox_select_transaction_'));
for(const c of cbs){ const st=await p.locator(`[data-test-id=${c}]`).getAttribute('aria-checked'); if(st!=='true'){ await p.click(`[data-test-id=${c}]`); await p.waitForTimeout(700);} }
await p.click('[data-test-id=select_payment_method]'); await p.waitForTimeout(800); await p.locator('.q-menu .q-item').filter({hasText:/^\s*Cash/i}).first().click().catch(async()=>{ await p.locator('.q-menu .q-item').first().click(); }); await p.waitForTimeout(800);
R.amount=await p.locator('[data-test-id=text_payment_amount]').innerText(); console.log('pay amount',R.amount); await p.screenshot({path:`../ev/${E}-RC-7-ready.png`});
await p.click('[data-test-id=button_make_payment]'); await p.waitForTimeout(3000); const btns=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].map(b=>b.innerText.replace(/\s+/g,' ')).filter(Boolean)); console.log('after make',JSON.stringify(btns).slice(0,300));
await s.go('/workorders/'+wo+'/finance'); await p.waitForTimeout(4000); await p.click('[data-test-id=button_wo_invoice_menu]'); await p.waitForTimeout(900);
R.menu=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(i=>({t:i.innerText.replace(/\s+/g,' '),dis:i.getAttribute('aria-disabled')||i.className.includes('disabled')}))); console.log('menu',JSON.stringify(R.menu));
const rev=p.locator('.q-menu .q-item').filter({hasText:'Reverse'}).first(); const b=await rev.boundingBox(); await p.mouse.move(b.x+b.width/2-20,b.y+b.height/2,{steps:4}); await p.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:4}); await p.waitForTimeout(1800);
R.tooltip=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(m=>m.getBoundingClientRect().width>0).map(m=>{const r=m.getBoundingClientRect();return {tid:m.getAttribute('data-test-id'),x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),style:(m.getAttribute('style')||'').slice(0,140),text:m.innerText.replace(/\s+/g,' ')}}));
console.log('tooltip',JSON.stringify(R.tooltip)); await p.screenshot({path:`../ev/${E}-RC-9-reverse-tooltip.png`});
fs.writeFileSync(`../ev/${E}-pay.json`,JSON.stringify(R,null,1)); await s.close(); process.exit(0);
