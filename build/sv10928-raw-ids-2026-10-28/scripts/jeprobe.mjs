// Does an inventory cycle count put a Journal Entry into Unexported Items? (branch: QuickBooks "needs reconnecting", so exports queue)
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa28'),user:'bilal.muzamil@shopview.com'});
const post=(u,b)=>s.api(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
const je=async()=>((await s.api('/api/bookkeeping/unexported-items?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=100&filters%5B0%5D%5Bfield%5D=groupName&filters%5B0%5D%5Bvalue%5D=journal_entry')).json?.data?.collection||[]);
console.log('JE before',(await je()).length);
const r=await s.api('/api/inventory/parts?limit=5&search=ZZPV590814'); const P=(r.json?.data?.parts||r.json?.data?.collection||r.json?.data||[])[0];
const bin=P.binLocations[0]; console.log('part',P.part_number,'qty',P.quantity,'bin',bin.binLocationId);
console.log('cycle count',JSON.stringify(await post('/api/inventory/parts/cycle-count',{part_quantities:[{id:P.id,bins:[{id:bin.binLocationId,quantity:2}]}]})).slice(0,150));
await new Promise(r=>setTimeout(r,5000)); const after=await je(); console.log('JE after',after.length,JSON.stringify(after.slice(0,2)).slice(0,500));
await s.close(); process.exit(0);
