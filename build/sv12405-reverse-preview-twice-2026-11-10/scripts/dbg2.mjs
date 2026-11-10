import {sess} from './common.mjs';
const s=await sess(); const p=s.page; const WO=process.env.WO;
const vis=async tid=>p.evaluate(t=>[...document.querySelectorAll(`[data-test-id="${t}"]`)].map(e=>{const r=e.getBoundingClientRect(); return Math.round(r.width)+'x'+Math.round(r.height)+'@'+Math.round(r.x)+','+Math.round(r.y);}),tid);
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(2500); await s.glideClick('link_finance_tab'); await p.waitForTimeout(7000);
console.log('create',await vis('button_create_invoice'),'menu',await vis('button_wo_invoice_menu'));
await s.glideClick('button_close_payment_dialog').catch(e=>console.log('noclose')); await p.waitForTimeout(5000);
console.log('after close: create',await vis('button_create_invoice'),'menu',await vis('button_wo_invoice_menu'),'badges',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id=badge_wo_status]')].map(e=>e.innerText).join('|')));
await p.screenshot({path:'../ev/dbg-2-after-close.png'}); await s.close(); process.exit(0);
