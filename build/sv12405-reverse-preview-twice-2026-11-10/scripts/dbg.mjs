import {sess} from './common.mjs';
const s=await sess(); const p=s.page; const WO=process.env.WO;
const vis=async tid=>p.evaluate(t=>[...document.querySelectorAll(`[data-test-id="${t}"]`)].map(e=>{const r=e.getBoundingClientRect(); return Math.round(r.width)+'x'+Math.round(r.height)+'@'+Math.round(r.x)+','+Math.round(r.y);}),tid);
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(2500); await s.glideClick('link_finance_tab'); await p.waitForTimeout(7000);
console.log('create',await vis('button_create_invoice'),'menu',await vis('button_wo_invoice_menu'),'badge',await p.locator('[data-test-id=badge_wo_status]').innerText());
await s.glideClick('button_create_invoice'); await p.waitForTimeout(5000); await p.screenshot({path:'../ev/dbg-1-after-create.png'});
const tids=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')).slice(0,12).join(',')); console.log('dialog tids',tids);
console.log('closepay',await vis('button_close_payment_dialog'),'badge',await p.locator('[data-test-id=badge_wo_status]').first().innerText());
await s.close(); process.exit(0);
