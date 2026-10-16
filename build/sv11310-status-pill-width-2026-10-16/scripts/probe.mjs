import {open} from './qa.mjs'; import fs from 'fs';
const env=process.argv[2]; const C=JSON.parse(fs.readFileSync('/tmp/qa11398/cookies.json'));
const o= env==='prod'? {env:'prod',dir:'/tmp/qa11310',user:'bilal.muzamil@shopview.com'} : {env:'staging',dir:'/tmp/qa11310',cookies:C,quick:'admin'};
const s=await open(Object.assign(o,{vp:{width:1600,height:1000},dpr:2})); const p=s.page;
const mk=await s.marker(); console.log('marker',JSON.stringify(mk));
await s.go('/workorders?tab=all'); await p.waitForTimeout(6000);
console.log('url',p.url());
const info=await p.evaluate(()=>{
 const tids=[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/,'<id>')))].slice(0,120);
 const ths=[...document.querySelectorAll('th')].map(t=>t.innerText.trim()).filter(Boolean);
 const st=[...document.querySelectorAll('*')].filter(e=>e.children.length===0 && /^(Approved|Complete|Estimate|Invoiced|Paid|Ready For Review|Declined|Imported)$/i.test(e.innerText?.trim()||'')).slice(0,6).map(e=>{const chain=[];let x=e;for(let i=0;i<5&&x;i++){const r=x.getBoundingClientRect();chain.push(`${x.tagName}.${(x.className||'').toString().slice(0,60)} tid=${x.getAttribute('data-test-id')} w=${r.width.toFixed(1)}`);x=x.parentElement;}return {t:e.innerText,chain};});
 return {tids,ths,st};});
console.log(JSON.stringify(info,null,1).slice(0,6000));
await p.screenshot({path:`/tmp/qa11310/${env}-list.png`});
await s.close();
