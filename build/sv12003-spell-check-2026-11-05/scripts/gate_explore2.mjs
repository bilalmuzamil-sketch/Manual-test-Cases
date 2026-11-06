import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess({dir:'/tmp/qa94'}); const p=s.page; const WO=process.argv[2];
await s.go('/workorders/'+WO+'/lines'); await p.waitForTimeout(4000);
const ids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0}).map(e=>e.getAttribute('data-test-id')+'|'+(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,40)).filter(x=>/complet|story|status|review|wizard/i.test(x)));
console.log(JSON.stringify([...new Set(ids)],null,0)); await p.screenshot({path:'/tmp/sv12003/wo-lines.png'});
await s.close(); process.exit(0);
