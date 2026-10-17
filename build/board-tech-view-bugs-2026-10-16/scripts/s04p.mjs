import {session} from './rec.mjs';
const s=await session({vp:{width:1440,height:900},dpr:1}); const p=s.page; await s.go('/workorders?tab=all'); await p.waitForTimeout(4000);
console.log(await p.evaluate(()=>{const e=document.querySelector('[data-test-id=page_search_toggle] svg'); return e.outerHTML.replace(/ data-v-[a-z0-9]+=""/g,'');}));
console.log(await p.evaluate(()=>{const e=document.querySelector('svg[data-icon=list]'); return e?e.outerHTML.replace(/ data-v-[a-z0-9]+=""/g,'').slice(0,300):'';}));
await s.close();
