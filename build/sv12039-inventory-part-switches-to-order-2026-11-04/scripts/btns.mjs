import {sess} from './common.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('/tmp/sv12039/wo-explore.json','utf8'));
const s=await sess(); const p=s.page; await s.go(`/workorders/${W.wo}/lines`); await p.waitForTimeout(6000);
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('button,[role=button]')].filter(b=>b.offsetParent).map(b=>(b.innerText||'').replace(/\s+/g,' ').trim().slice(0,30)+'|'+(b.getAttribute('data-test-id')||'')+'|'+Math.round(b.getBoundingClientRect().y)))));
await p.screenshot({path:'ev/explore/lines.png'}); await s.close(); process.exit(0);
