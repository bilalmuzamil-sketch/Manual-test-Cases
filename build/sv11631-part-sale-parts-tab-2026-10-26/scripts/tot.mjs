import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:1});
const p=s.page;
for (const [n,id] of [['P2-162','90a95f29-f405-4763-834d-6e3a237f8c33'],['P2-109','48ba5757-175a-4701-8c4a-810791ac2ede']]){
 await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(6500);
 const fin=await p.evaluate(()=>{const t=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&/^Financial Info$/.test(e.textContent.trim())); let c=t; for(let i=0;i<4&&c;i++)c=c.parentElement; return c?c.innerText.replace(/\n+/g,' | '):null});
 const parts=(await s.api(`/api/work-orders/${id}/parts/list-requests-by-line?search=`)).json.data.collection.flatMap(l=>l.part_requests);
 const sum=parts.reduce((a,x)=>a+Number(x.sell_price||0)*Number(x.quantity||0),0);
 console.log(n,'screen:',fin,'| sum sell*qty of',parts.length,'parts =',sum.toFixed(2), '| statuses', parts.map(x=>x.status).join(','));
}
process.exit(0);
