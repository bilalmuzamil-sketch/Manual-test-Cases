import {ob,j} from './lib.mjs'; import fs from 'fs';
const {wo}=JSON.parse(fs.readFileSync('wo-L.json'));
const s=await ob(); const p=s.page; await s.go(`/workorders/${wo}/lines`);
const x=await p.evaluate(()=>[...document.querySelectorAll('input,textarea')].map(e=>({tag:e.tagName,ph:e.placeholder,tid:e.getAttribute('data-test-id')||e.closest('[data-test-id]')?.getAttribute('data-test-id'),w:e.getBoundingClientRect().width})));
console.log(j(x,1200)); await s.close();
