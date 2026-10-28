import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
const m=await s.api('/api/parts-catalogue/manufacturers'); const L=m.json?.data?.collection||m.json?.data||[]; const arr=Array.isArray(L)?L:[];
const ids=arr.map(x=>[x.id||x.value,x.name||x.label]); console.log('manufacturers',ids.length,JSON.stringify(ids.slice(0,3)), 'has 387616f5',ids.some(x=>String(x[0]).startsWith('387616f5')),'has 26aa6e80',ids.some(x=>String(x[0]).startsWith('26aa6e80')));
const M=ids.find(x=>x[1]&&x[1].trim()); const pn='ZZMF'+Date.now()%1000000;
const c=await s.api('/api/parts-catalogue/add-catalogue-part',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'ZZAUTOTEST manufacturer pick',part_number:pn,tags:[],manufacturer_id:M[0]})});
console.log('catalog',c.status,JSON.stringify(c.json).slice(0,120),'pn',pn,'manufacturer',M[1]);
const chk=await s.api('/api/parts-catalogue/catalogue-parts?pagination%5BrowsPerPage%5D=5&pagination%5Bpage%5D=1&search='+pn); console.log('check',JSON.stringify((chk.json?.data?.collection||[])[0]||{}).match(/"manufacturer_(id|name)":[^,]*/g));
await s.close(); process.exit(0);
