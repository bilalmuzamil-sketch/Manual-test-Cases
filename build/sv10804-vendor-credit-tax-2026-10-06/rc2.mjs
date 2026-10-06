import fs from 'fs'; import {ob,j} from './lib.mjs';
const R=JSON.parse(fs.readFileSync(`run-${process.argv[2]}.json`)); const taxOverride=process.argv[3];
const s=await ob({vp:{width:1700,height:1000},dpr:2}); const P=s.page;
await s.go('/workorders/'+R.wo+'/lines');
const find=()=>P.evaluate(id=>{const pn=document.querySelector(`[data-test-id="part_number_${id}"]`); let row=pn; for(let i=0;i<8;i++){row=row.parentElement; const b=row.querySelector('[data-test-id="button_part_request_action"]'); if(b){b.scrollIntoView({block:'center'}); const r=b.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};}}},R.prid);
await find(); await P.waitForTimeout(400); const p=await find(); await P.mouse.click(p.x,p.y); await P.waitForTimeout(2500);
const V=R.vendor; const inv=('ZZ10804RCV-'+R.tag).slice(0,21);
await P.fill(`[data-test-id="input_invoice_number_${V}"]`,inv);
const cb=await P.locator(`.q-dialog [data-test-id^="checkbox_receive_part_"]`).first(); let bb=await cb.boundingBox(); await P.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await P.waitForTimeout(1200);
if(taxOverride){ await P.fill(`[data-test-id="input_tax_${V}"]`,taxOverride); await P.waitForTimeout(800);}
const vals=await P.evaluate(V=>({tax:document.querySelector(`[data-test-id="input_tax_${V}"]`)?.value, sub:document.querySelector(`[data-test-id="currency_text_card_subtotal_${V}"]`)?.innerText, tot:document.querySelector(`[data-test-id="currency_text_card_footer_total_${V}"]`)?.innerText}),V);
console.log('dialog',j(vals));
await P.screenshot({path:`${R.tag}-03-receive-filled.png`});
const rb=P.locator(`[data-test-id="button_receive_vendor_${V}"]`); bb=await rb.boundingBox(); await P.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await P.waitForTimeout(4000);
console.log(s.writes.filter(w=>!/envelope|touch/.test(w)).join('\n').slice(0,1200));
R.invoice=inv; R.receive=vals; fs.writeFileSync(`run-${R.tag}.json`,JSON.stringify(R));
await s.close();
