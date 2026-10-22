import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const o= env==='prod'?{env:'prod',user:'bilal.muzamil@shopview.com'}:{env:'branch',ticket:'11588',cookies:JSON.parse(fs.readFileSync('/tmp/qa11588/cookies.json')),quick:'admin'};
const s=await open({...o,dir:'/tmp/qa21',vp:{width:1600,height:1000},dpr:1}); const p=s.page;
await s.go('/workorders'); await p.waitForTimeout(5000); {const b=await p.$('[data-test-id=display_option_board_view]'); const bb=await b.boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);} await p.waitForSelector('[data-test-id^=board_column_header_]',{timeout:60000}).catch(()=>{}); await p.waitForTimeout(3000);
console.log(env,JSON.stringify(await p.evaluate(()=>{const N=v=>v.includes('url(')?'CUSTOM'+v.slice(v.lastIndexOf(')')+1):v; const out={};
 for(const h of document.querySelectorAll('[data-test-id^=board_column_header_]')){ for(const e of [h,...h.querySelectorAll('*')]){ const c=N(getComputedStyle(e).cursor); const k=(h.getAttribute('data-test-id').includes('unassigned')?'UNASSIGNED ':'TECH ')+(e.getAttribute('data-test-id')||e.getAttribute('class')||e.tagName).toString().replace(/[0-9a-f]{8}-[0-9a-f-]{27,}/g,'<id>').slice(0,50)+' => '+c; out[k]=(out[k]||0)+1; } }
 return out;})));
await s.close();
