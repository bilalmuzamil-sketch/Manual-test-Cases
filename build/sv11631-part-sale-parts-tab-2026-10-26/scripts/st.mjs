import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2,scrollbars:true});
const p=s.page; await s.go('/parts/part-sale/48ba5757-175a-4701-8c4a-810791ac2ede/part-requests'); await p.waitForTimeout(6500);
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.base-table tbody .status-cell')].map(c=>{const b=c.querySelector('.q-badge'); return (b?b.innerText.trim():'-')+' badge='+(b?Math.round(b.getBoundingClientRect().width):0)+' cell='+Math.round(c.getBoundingClientRect().width)}))));
const st=(await s.api('/api/work-orders/48ba5757-175a-4701-8c4a-810791ac2ede/parts/list-requests-by-line?search=')).json.data.collection.flatMap(l=>l.part_requests).map(x=>x.part_number+':'+x.status+'/'+x.status_label); console.log(st.join(' | '));
await p.screenshot({path:'/tmp/qa11631/w/p2109-1440-scroll.png'}); process.exit(0);
