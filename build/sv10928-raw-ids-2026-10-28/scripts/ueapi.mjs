import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env]=process.argv.slice(2);
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
for(const g of ['journal_entry','customer','vendor']){ const r=await s.api('/api/bookkeeping/unexported-items?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=100&filters%5B0%5D%5Bfield%5D=groupName&filters%5B0%5D%5Bvalue%5D='+g);
 const c=r.json?.data?.collection||[]; console.log(g,r.status,c.length, c[0]?Object.keys(c[0]).join(','):'', JSON.stringify(c.filter(x=>!x.user&&!x.userName&&!x.createdBy).slice(0,2)).slice(0,400)); }
await s.close(); process.exit(0);
