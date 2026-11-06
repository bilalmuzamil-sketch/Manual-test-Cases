// node labels.mjs <vendorId> -> exact on-screen text of the vendor page buttons/tabs used in the repro steps
import {sess} from './common.mjs'; const s=await sess(); const p=s.page; await s.go('/parts/vendor/'+process.argv[2]+'/unpaid-invoices'); await p.waitForTimeout(3500);
console.log(JSON.stringify(await p.evaluate(()=>['button_new_credit_vendor','button_new_payment','tab_unpaid-invoices','tab_payments'].map(i=>i+'='+document.querySelector(`[data-test-id="${i}"]`)?.innerText.trim()))));
await s.close(); process.exit(0);
