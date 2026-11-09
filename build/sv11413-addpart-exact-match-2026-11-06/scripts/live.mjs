// live re-check 9 Nov: Add Part search "brake" -> capture the screen's own search response; count rows / distinct parts; find tagged parts
import {sess,arr} from './common.mjs'; import fs from 'fs'; const E=process.env.ENV||'branch'; const W=JSON.parse(fs.readFileSync(`/tmp/sv11413-${E}-wo.json`,'utf8'));
const s=await sess(); const p=s.page; let last=null;
p.on('response',async r=>{ if(r.request().method()==='GET'&&/\/api\/.*part/i.test(r.url())&&/search|q=|term/i.test(r.url())){ try{ last={url:r.url().replace(/^https:\/\/[^/]+/,''),j:await r.json()}; }catch{} } });
console.log('marker',await p.evaluate(()=>document.querySelector('meta[name=app-version]')?.content).catch(()=>null));
await s.go('/workorders/'+W.id+'/lines'); await p.waitForTimeout(8000);
console.log('marker',await p.evaluate(()=>document.querySelector('meta[name=app-version]')?.content));
await p.click('[data-test-id="button_add_part"]'); await p.waitForTimeout(3000);
const sel=p.locator('[data-test-id="select_inline_part_number"]').first(); await sel.click(); await p.waitForTimeout(1500);
await p.keyboard.type(process.env.Q||'brake',{delay:80}); await p.waitForTimeout(6000);
const c=last?.j?.data?.collection||[]; console.log('url',last?.url?.slice(0,200));
const by={}; c.forEach(r=>{by[r.value]=(by[r.value]||0)+1});
console.log('rows',c.length,'distinct',Object.keys(by).length,'types',JSON.stringify(c.reduce((a,r)=>(a[r.part_type]=(a[r.part_type]||0)+1,a),{})),'withTags',c.filter(r=>r.tags&&r.tags.length).length);
const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,80)));
console.log('options on screen',opts.length); console.log('chamber in rows', c.some(r=>/FLT3030LCB20/.test(r.part_number)), 'on screen', opts.some(o=>/FLT3030LCB20|SPRING BRAKE CHAMBER/.test(o)));
fs.writeFileSync(`../ev/live-0911-${E}-${process.env.Q||'brake'}.json`,JSON.stringify({url:last?.url,collection:c}));
await p.screenshot({path:`../ev/live-0911-${E}-${process.env.Q||'brake'}.png`}); await s.close(); process.exit(0);
