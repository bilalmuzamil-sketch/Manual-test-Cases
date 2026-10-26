import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:1});
const id='48ba5757-175a-4701-8c4a-810791ac2ede';
const parts=(await s.api(`/api/work-orders/${id}/parts/list-requests-by-line?search=`)).json.data.collection.flatMap(l=>l.part_requests);
for(const x of parts){const o={}; for(const k of Object.keys(x)) if(/core|price|quant|status|number|declin|parent|is_|type|cost/i.test(k) && typeof x[k]!=='object') o[k]=x[k]; console.log(JSON.stringify(o).slice(0,400));}
process.exit(0);
