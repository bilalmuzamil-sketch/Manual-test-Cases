import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:(process.env.QA_DIR||'/tmp/qa26'),vp:{width:1440,height:900},dpr:2,scrollbars:true}); const p=s.page;
await s.go('/parts/part-sale/90a95f29-f405-4763-834d-6e3a237f8c33/part-requests'); await p.waitForTimeout(7000);
await p.evaluate(()=>document.querySelectorAll('.q-notification').forEach(n=>n.remove()));
await p.evaluate(()=>{const w=[...document.querySelectorAll('.q-table__middle')].sort((a,b)=>b.scrollWidth-a.scrollWidth)[0]; w.scrollLeft=w.scrollWidth;});
await p.waitForTimeout(800); await p.screenshot({path:'/tmp/qa11631/w/feecol-1440-scrolled.png'});
const cells=await p.evaluate(()=>[...document.querySelectorAll('td.fees-cell')].map(td=>{const r=td.getBoundingClientRect(); return {t:td.innerText.replace(/\n/g,' | '),b:[r.x,r.y,r.width,r.height].map(Math.round),html:td.innerHTML.slice(0,300)}}));
console.log(JSON.stringify(cells,null,1).slice(0,1500));
const c=cells.find(x=>x.t); if(c){ await p.mouse.move(c.b[0]+20,c.b[1]+c.b[3]/2,{steps:5}); await p.waitForTimeout(1500);
 console.log('hover tips',await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].filter(t=>t.getBoundingClientRect().height>0).map(t=>t.innerText.trim()))); await p.screenshot({path:'/tmp/qa11631/w/feecol-1440-hover.png'}); }
await s.close(); process.exit(0);
