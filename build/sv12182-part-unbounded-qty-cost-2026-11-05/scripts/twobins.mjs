// usage: node twobins.mjs <partSearch> <qty0> <qty1> -> edit dialog: set bin 0 qty, Add Bin Location (pick first other bin), set bin 1 qty, Save; prints response + toasts
import {sess} from './common.mjs'; const [Q,A,B]=process.argv.slice(2); const s=await sess({dpr:2}); const p=s.page; const resp=[];
p.on('response',async r=>{ if(/inventory\/parts\/(change|create)/.test(r.url())){ let b=''; try{ b=await r.text(); }catch(e){} resp.push(r.status()+' '+b.slice(0,400)); } });
await s.go('/parts/inventory'); await p.waitForTimeout(5000); await p.locator('table tbody tr').filter({hasText:Q}).first().click(); await p.waitForTimeout(3000);
const set=async(id,v)=>{ const f=p.locator(`[data-test-id="${id}"]`); await f.click({clickCount:3}); await f.fill(''); await p.keyboard.type(v,{delay:10}); await p.keyboard.press('Tab'); await p.waitForTimeout(500); };
await set('input_quantity_0',A); await p.locator('[data-test-id="button_add_bin_location"]').click(); await p.waitForTimeout(1200);
await p.locator('[data-test-id="select_bin_location_1"]').click(); await p.waitForTimeout(1000); const opts=p.locator('.q-menu .q-item'); console.log('bin options',await opts.count()); await opts.nth(1).click(); await p.waitForTimeout(800);
await set('input_quantity_1',B); await p.screenshot({path:'../ev/D-twobins-1-typed.png'}); await p.locator('[data-test-id="button_confirm_dialog"]').click(); await p.waitForTimeout(3500);
console.log('RESP',JSON.stringify(resp)); console.log('NOTIF',JSON.stringify(await p.locator('.q-notification').allInnerTexts())); await p.screenshot({path:'../ev/D-twobins-2-after.png'}); await s.close(); process.exit(0);
