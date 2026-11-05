// usage: node setval.mjs <partSearch> <field=input_average_cost|input_quantity_0|input_sell_price> <value> <shot> -> edit dialog, type value, Save; prints request, response status+body, on-screen errors/notifications, whether dialog stayed open; reopens and reads stored value
import {sess} from './common.mjs'; const [Q,FLD,VAL,SH]=process.argv.slice(2); const s=await sess({dpr:2}); const p=s.page; const resp=[];
p.on('response',async r=>{ if(/inventory\/parts\/(change|create)/.test(r.url())){ let b=''; try{ b=await r.text(); }catch(e){} resp.push(r.status()+' '+b.slice(0,400)); } });
await s.go('/parts/inventory'); await p.waitForTimeout(5000);
const open=async()=>{ await p.locator('table tbody tr').filter({hasText:Q}).first().click(); await p.waitForTimeout(3000); };
await open(); const f=p.locator(`[data-test-id="${FLD}"]`); console.log('before',await f.inputValue()); await f.click({clickCount:3}); await f.fill(''); await p.keyboard.type(VAL,{delay:15}); await p.keyboard.press('Tab'); await p.waitForTimeout(800);
console.log('shown after typing',await f.inputValue()); await p.screenshot({path:`../ev/${SH}-1-typed.png`}); const n=s.writes.length;
await p.locator('[data-test-id="button_confirm_dialog"]').click(); await p.waitForTimeout(3500);
console.log('SENT',JSON.stringify(s.writes.slice(n).filter(w=>/inventory/.test(w)).map(w=>w.slice(0,300)))); console.log('RESP',JSON.stringify(resp));
console.log('NOTIF',JSON.stringify(await p.locator('.q-notification').allInnerTexts())); console.log('FIELD ERRORS',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-field--error .q-field__messages, .q-field__bottom, [role=alert]')].filter(e=>e.offsetParent&&e.innerText.trim()).map(e=>e.innerText.trim()))));
const still=await p.locator('.q-dialog').count(); console.log('dialog open after save',still>0); await p.screenshot({path:`../ev/${SH}-2-after-save.png`});
if(still){ await p.keyboard.press('Escape'); await p.waitForTimeout(1200); } await s.go('/parts/inventory'); await p.waitForTimeout(4000); await open(); console.log('stored now',await p.locator(`[data-test-id="${FLD}"]`).inputValue());
await s.close(); process.exit(0);
