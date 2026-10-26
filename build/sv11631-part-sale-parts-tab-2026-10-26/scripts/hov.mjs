import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2,scrollbars:true});
const p=s.page; const O='/tmp/qa11631/w/hov/'; fs.mkdirSync(O,{recursive:true}); const res={};
await s.go('/parts/part-sale/48ba5757-175a-4701-8c4a-810791ac2ede/part-requests'); await p.waitForTimeout(6500);
const tip=()=>p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(t=>t.getBoundingClientRect().height>0).map(t=>{const r=t.getBoundingClientRect();return {t:t.innerText.trim(),b:[r.x,r.y,r.width,r.height]}}));
const box=sel=>p.evaluate(sel=>{const e=document.querySelector(sel); if(!e) return null; e.scrollIntoView({block:'center',inline:'nearest'}); const r=e.getBoundingClientRect(); return [r.x,r.y,r.width,r.height]},sel);
const hover=async(name,sel,dx=0.5)=>{ await p.mouse.move(5,5); await p.waitForTimeout(400); const b=await box(sel); if(!b){res[name]='no element';return;} await p.mouse.move(b[0]+b[2]*dx,b[1]+b[3]/2,{steps:6}); await p.waitForTimeout(1500); res[name]={box:b,tips:await tip()}; await p.screenshot({path:O+name+'.png'}); };
const R1='.base-table tbody tr:nth-child(2)'; // first real row after spacer
await hover('desc_long',`${R1} .description-cell .q-field__native`,0.4);
await hover('cat_long',`${R1} .category-cell .q-field__native`,0.4);
await hover('vendor_long',`${R1} .vendor-cell`,0.4);
await hover('avatar',`${R1} td:first-child .q-avatar, ${R1} .q-avatar`,0.5);
await hover('pn',`${R1} .part-number-cell input`,0.5);
await hover('row_blank',`${R1} .status-cell`,0.5);
// avatar tooltip: leave + scroll
const av=await box(`${R1} .q-avatar`); await p.mouse.move(av[0]+av[2]/2,av[1]+av[3]/2,{steps:5}); await p.waitForTimeout(1500); res.avatar_before_leave=await tip();
await p.mouse.move(av[0]+av[2]+60,av[1]+av[3]/2,{steps:5}); await p.waitForTimeout(800); res.avatar_after_leave=await tip();
await p.mouse.move(av[0]+av[2]/2,av[1]+av[3]/2,{steps:5}); await p.waitForTimeout(1500); res.avatar_again=await tip();
await p.mouse.wheel(0,300); await p.waitForTimeout(900); res.avatar_after_scroll=await tip(); res.scrolledY=await p.evaluate(()=>[scrollY,document.querySelector('.q-page-container, main')?.scrollTop]);
fs.writeFileSync(O+'hov.json',JSON.stringify(res,null,1)); console.log(JSON.stringify(res,null,0).slice(0,2500)); process.exit(0);
