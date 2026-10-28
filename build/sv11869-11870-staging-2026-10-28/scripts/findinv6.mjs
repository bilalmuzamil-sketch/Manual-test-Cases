// Imported historical invoices = work orders with status "imported". List them via the Work Orders list request, then open the Imported list on screen.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'staging',ticket:'x',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:process.env.QA_DIR||'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin',vp:{width:1600,height:1000}});
const p=s.page; const LOC='b3c8c820-f815-4cf1-8938-10956c5ee71a'; await s.go('/workorders'); await p.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC);
const q='pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=50&pagination%5BsortBy%5D=startDate&pagination%5Bdescending%5D=true&filters%5B0%5D%5Bfield%5D=status&filters%5B0%5D%5Bvalue%5D=imported';
const r=await s.api('/api/work-orders?'+q,{headers:{'x-location-id':LOC}}); const w=r.json?.data?.work_orders||[];
console.log('imported',r.status,w.length, JSON.stringify(Object.keys(w[0]||{}))); for(const x of w.slice(0,8)) console.log(JSON.stringify(x).replace(/"[a-z_A-Z]*":(null|""|false|[])/g,'').slice(0,330));
if(!w.length) console.log(JSON.stringify(r.json).slice(0,300), JSON.stringify(Object.keys((r.json?.data?.work_orders||[{}])[0]||{})));
fs.writeFileSync('/tmp/qa30/imported.json',JSON.stringify(w));
await s.close(); process.exit(0);
