import {ob,j} from './lib.mjs'; import fs from 'fs';
const {wo}=JSON.parse(fs.readFileSync('wo-A.json')); const s=await ob(); const p=s.page; await s.go(`/workorders/${wo}/lines`); await p.waitForTimeout(1200);
console.log(j(await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>/^Pick$/.test(b.innerText.trim())).map(b=>{let e=b,txt='';for(let i=0;i<6&&e;i++){e=e.parentElement;if(e&&/\(.+\)/.test(e.innerText)){txt=e.innerText.replace(/\s+/g,' ').slice(0,80);break;}} return {tid:b.getAttribute('data-test-id'),txt};})),1500));
await s.close();
