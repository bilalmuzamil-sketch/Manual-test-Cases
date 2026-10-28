// Parts -> Returns -> Create Return (manual): vendor, packing slip, one manual part; save. On screen.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,vendor]=process.argv.slice(2); const out=`/tmp/s10928/${env}-returns`; fs.mkdirSync(out,{recursive:true});
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa24'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
const caps=[]; p.on('response',async r=>{ if(r.request().method()==='POST'&&/shopview\.com\/api\//.test(r.url())) caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(await r.text().catch(()=>'')).slice(0,300)); });
await s.go('/parts/returns'); await p.waitForTimeout(4000);
await p.locator('[data-test-id="button_create_return"]').click(); await p.waitForTimeout(2500);
const slip='ZZ'+(Date.now()%100000);
const typeIn=async(t,v)=>{ const l=p.locator(`[data-test-id="${t}"] input, input[data-test-id="${t}"]`).first(); await l.click(); await l.fill(v); };
const vs=p.locator('[data-test-id="select_vendor"]').first(); await vs.click(); await p.waitForTimeout(800); await p.keyboard.type(vendor,{delay:50}); await p.waitForTimeout(2500);
await p.locator('.q-menu .q-item',{hasText:vendor}).first().click(); await p.waitForTimeout(800);
await typeIn('input_packaging_slip',slip);
await typeIn('input_manual_return_part_description','ZZAUTOTEST manual return part');
await typeIn('input_manual_return_part_quantity','1'); await typeIn('input_manual_return_part_price','12.5');

await p.screenshot({path:out+'/create-return-filled.png'});
await p.locator('[data-test-id="button_save_manual_return"]').click(); await p.waitForTimeout(4000);
await p.screenshot({path:out+'/create-return-saved.png'});
console.log('slip',slip); console.log(caps.join('\n')); console.log('url',p.url()); await s.close();
