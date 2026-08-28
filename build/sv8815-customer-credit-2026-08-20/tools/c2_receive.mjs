import { open, ensureHD } from '/tmp/sv8815-staging/boot.mjs';
const PO=process.argv[2];
const s=await open(); const p=s.page;
await ensureHD(s);
p.on('response',async r=>{ if(/receive-requested-parts/.test(r.url()))
  console.log('   receive ->',r.status(),(await r.text().catch(()=>'')).slice(0,160)); });
await p.goto(`${s.APP}/order/${PO}?receive=1`,{waitUntil:'domcontentloaded',timeout:60000});
await p.waitForTimeout(15000);
const ids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(x=>/invoice|qty|receive/.test(x)));
console.log('controls:',JSON.stringify(ids));
const inv=await p.$(`[data-test-id="input_invoice_${PO}"]`);
if(inv){ await inv.click(); await inv.type('ZZ8815-EF',{delay:35}); }
for(const id of ids.filter(x=>x.startsWith('input_qty_'))){
  const el=await p.$(`[data-test-id="${id}"]`);
  if(el){ await el.click(); await el.fill(''); await el.type('1',{delay:35}); }
}
await p.waitForTimeout(1500);
const b=await p.evaluate(po=>{const x=document.querySelector(`[data-test-id="button_receive_po_${po}"]`);
  if(!x) return null; x.scrollIntoView({block:'center',behavior:'instant'});
  const r=x.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,dis:x.disabled};},PO);
console.log('receive button:',JSON.stringify(b));
if(b&&!b.dis){ await p.mouse.click(b.x+b.w/2,b.y+b.h/2); await p.waitForTimeout(12000); }
await p.screenshot({path:'/tmp/sv8815-staging/C2-received.png',fullPage:true});
await s.browser.close();
