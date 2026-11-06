// node early.mjs -> open Edit Customer, wait WAIT ms, click Save without changing anything; log every API request from open to +6 s, and whether the dialog closes. ../ev/<env>-early-<wait>.json
import {sess} from './common.mjs'; import fs from 'fs';
const E=process.env.ENV==='prod'?'prod':'branch'; const W=+(process.env.WAIT||1500); const s=await sess(); const p=s.page; const log=[]; const t0={v:0};
p.on('request',r=>{ if(/\/api\//.test(r.url())) log.push({ms:Date.now()-t0.v,m:r.method(),u:r.url().replace(/^https:\/\/[^/]+/,'').slice(0,90)}); });
p.on('response',r=>{ if(/\/api\//.test(r.url())) log.push({ms:Date.now()-t0.v,status:r.status(),u:r.url().replace(/^https:\/\/[^/]+/,'').slice(0,90)}); });
const list=(await s.api('/api/customers?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=5')).json.data.collection; const c=list[1];
await s.go('/customers/'+c.id); await p.waitForTimeout(3500); log.length=0; t0.v=Date.now();
await p.click('[data-test-id=button_base]'); await p.waitForTimeout(W); log.push({ms:Date.now()-t0.v,click:'save'});
await p.click('[data-test-id=button_save_customer]'); await p.waitForTimeout(6000);
const open=await p.locator('.q-dialog [data-test-id=input_customer_name]').count();
const toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ')));
console.log(E,'wait',W,'dialogOpen',open>0,'toasts',JSON.stringify(toasts)); for(const l of log) console.log(JSON.stringify(l));
await p.screenshot({path:`../ev/${E}-early-${W}.png`}); fs.writeFileSync(`../ev/${E}-early-${W}.json`,JSON.stringify({log,open,toasts},null,1)); await s.close(); process.exit(0);
