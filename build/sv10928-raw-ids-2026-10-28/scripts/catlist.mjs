import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env]=process.argv.slice(2);
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa24'),user:'bilal.muzamil@shopview.com'});
const r=await s.api('/api/parts-catalogue/catalogue-parts?pagination%5BrowsPerPage%5D=100&pagination%5Bpage%5D=1&search=');
const L=r.json?.data?.parts||r.json?.data?.catalogue_parts||r.json?.data||[]; const arr=Array.isArray(L)?L:Object.values(L).find(Array.isArray)||[];
console.log('keys',Object.keys(r.json?.data||{}).join(','),'n',arr.length); console.log(JSON.stringify(arr[0]).slice(0,600));
console.log('with manufacturer',arr.filter(x=>x.manufacturer_id||x.manufacturer).slice(0,3).map(x=>x.id+' '+(x.part_number||x.partNumber)+' '+JSON.stringify(x.manufacturer||x.manufacturer_id)).join(' | '));
await s.close(); process.exit(0);
