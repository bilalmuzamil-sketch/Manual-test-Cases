import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; await s.go('/bulk-receive?ids=9483a4c2-4564-499d-8832-3f88a7763474,1be4d486-80d5-4d08-b938-b06e97e62f9e'); await p.waitForTimeout(5000);
const h=await p.evaluate(()=>{ const c=document.querySelector('[data-test-id="checkbox_po_9483a4c2-4564-499d-8832-3f88a7763474"]'); let e=c; for(let i=0;i<3;i++) e=e.parentElement; return e.outerHTML.replace(/\s+/g,' ').slice(0,2500); }); console.log(h);
const top=await p.evaluate(()=>{ const e=[...document.querySelectorAll('*')].filter(x=>/Expand All/.test(x.textContent)&&x.childElementCount<4).pop(); return e?.outerHTML.slice(0,400); }); console.log('EXPAND:',top);
await s.close(); process.exit(0);
