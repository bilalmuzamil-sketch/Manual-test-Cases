// Customer page → edit (pencil) → IBS field → Save, on screen. Usage: node ibsset.mjs <env> <customerName> <ibsNumber|"">
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,cname,val]=process.argv.slice(2); const LOC='b617914c-16e9-4485-8e8b-193cd86aa416'; const H=env==='prod'?{headers:{'x-location-id':LOC}}:{};
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com',vp:{width:1440,height:900}});
const p=s.page; if(env==='prod'){ await s.go('/workorders'); await p.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC); }
const cid=((await s.api('/api/customers?limit=5&search='+encodeURIComponent(cname),H)).json?.data?.collection||[]).find(x=>x.name===cname)?.id;
await s.go(`/customers/${cid}/work-orders`); await p.waitForTimeout(5000); await p.locator('[data-test-id="button_base"]').first().click(); await p.waitForTimeout(2000);
const f=p.locator('[data-test-id="input_customer_ibs"]'); const i=(await f.evaluate(e=>e.tagName))==='INPUT'?f:f.locator('input'); console.log('IBS before',JSON.stringify(await i.inputValue()));
await i.fill(val); await p.waitForTimeout(500); const w0=s.writes.length; await p.locator('[data-test-id="button_save_customer"]').click(); await p.waitForTimeout(3000);
console.log('saved',JSON.stringify(s.writes.slice(w0).filter(w=>!/envelope/.test(w)).map(w=>w.slice(0,160))));
console.log('ibs now',JSON.stringify(((await s.api('/api/customers?limit=5&search='+encodeURIComponent(cname),H)).json?.data?.collection||[]).find(x=>x.name===cname)?.ibs));
await s.close(); process.exit(0);
