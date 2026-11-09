// Finance tab: Create Invoice -> payment dialog -> payment method "Charge Account" -> Charge Account
import {sess,load,save,j} from './common.mjs'; import fs from 'fs';
const S=load(); const s=await sess(); const p=s.page; const out={reqs:[]};
p.on('response',async r=>{const q=r.request(); if(/\/api\//.test(r.url())&&q.method()!=='GET'&&!/6364962|recent/.test(r.url())) out.reqs.push([q.method(),r.url().replace(/https:\/\/[^/]+/,''),r.status(),(q.postData()||'').slice(0,300)]);});
await s.go('/workorders/'+S.wo+'/finance'); await p.waitForTimeout(8000);
await p.locator('[data-test-id="button_create_invoice"]').first().click(); await p.waitForTimeout(6000);
await p.screenshot({path:'/tmp/qa12299/C-1-after-create.png'});
// confirm dialogs that may appear (e.g. "Are you sure")
out.dlg1=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,300)));
const pm=p.locator('[data-test-id$="payment_method"]').first(); out.pmFound=await pm.count();
await pm.click(); await p.waitForTimeout(1200);
out.options=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim()));
await p.locator('.q-menu .q-item').filter({hasText:/Charge Account/i}).first().click(); await p.waitForTimeout(1000);
await p.screenshot({path:'/tmp/qa12299/C-2-charge-selected.png'});
await p.locator('[data-test-id="button_charge_account"]').click(); await p.waitForTimeout(6000);
out.notes=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText));
await p.screenshot({path:'/tmp/qa12299/C-3-after-charge.png'});
const W=(await s.api('/api/work-orders/view/'+S.wo)).json?.data; const X=W?.work_order||W; out.wo={n:X?.number,st:X?.status,inv:X?.invoice_id,invStatus:X?.invoice_status};
S.inv=X?.invoice_id; save(S); fs.writeFileSync('/tmp/qa12299/C.json',JSON.stringify(out,null,1)); console.log(j(out).slice(0,2500)); await s.close();
