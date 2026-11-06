import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const S=JSON.parse(fs.readFileSync(`/tmp/sv12143-${ENV}.json`,'utf8')); const s=await sess(); const p=s.page;
await s.go('/workorders/'+S.id+'/'+(process.env.TAB||'lines')); await p.waitForTimeout(8000);
const ids=await p.evaluate(()=>{const m={}; for(const e of document.querySelectorAll('[data-test-id]')){const k=e.getAttribute('data-test-id').replace(/[0-9a-f-]{36}/g,'<id>'); m[k]=(m[k]||0)+1;} return m;});
console.log('ids',JSON.stringify(ids)); console.log('drag',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[draggable="true"], .drag-handle, [class*="drag"], [class*="handle"]')].slice(0,10).map(e=>e.tagName+'.'+e.className.toString().slice(0,60)+'|'+(e.getAttribute('data-test-id')||'')))));
await p.screenshot({path:`../ev/${ENV}-look-${process.env.TAB||'lines'}.png`}); await s.close(); process.exit(0);
