// Counts customers whose page has no customer account (read-only).
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const H=env==='prod'?{headers:{'x-location-id':'b617914c-16e9-4485-8e8b-193cd86aa416'}}:{};
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
let n=0, none=[]; for(let pg=1;pg<=6;pg++){ const cs=(await s.api(`/api/customers?limit=100&page=${pg}&pagination%5Bpage%5D=${pg}&pagination%5BrowsPerPage%5D=100`,H)).json?.data?.collection||[]; if(!cs.length) break;
  for(const c of cs){ n++; const v=(await s.api('/api/customers/view/'+c.id+'?',H)).json?.data; const t=JSON.stringify(v); if(!/"(?:customer_)?account_id":"[0-9a-f-]{36}"/.test(t)) none.push(c.name); } if(cs.length<100) break; }
console.log('customers checked',n,'without an account',none.length,JSON.stringify(none.slice(0,10)));
await s.close(); process.exit(0);
