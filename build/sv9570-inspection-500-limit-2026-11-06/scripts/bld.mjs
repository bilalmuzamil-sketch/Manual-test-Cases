// open template builder for TPL id; dump ids + any "x / 500" text; MODE=add clicks ADDN times the add-field control (SEL) and reports counter/hint
import {sess} from './common.mjs'; const s=await sess(); const p=s.page; const TAG=process.env.TAG||'bld';
for(const r of ['/administration/inspection-templates/','/settings/inspection-templates/','/inspection-templates/']){ await s.go(r+process.env.TPL); await p.waitForTimeout(7000); if(await p.locator('[data-test-id="inspection_builder_page"]').count()){ console.log('route',r); break; } }
const ids=await p.evaluate(()=>{const m={}; for(const e of document.querySelectorAll('[data-test-id]')){const k=e.getAttribute('data-test-id').replace(/[0-9a-f-]{36}/g,'<id>').replace(/_\d+$/,'_<n>'); m[k]=(m[k]||0)+1;} return m;});
console.log('ids',JSON.stringify(Object.fromEntries(Object.entries(ids).filter(([k])=>!/nav|clock|notif|profile|module|search|skip/.test(k)))));
console.log('limit text',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.children.length===0&&/\/\s*500|500 fields|up to 500/i.test(e.textContent)).map(e=>(e.getAttribute('data-test-id')||e.className)+': '+e.textContent.trim()).slice(0,10))));
await p.screenshot({path:`../ev/branch-${TAG}.png`}); await s.close(); process.exit(0);
