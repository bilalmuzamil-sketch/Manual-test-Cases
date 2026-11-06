// node chunk.mjs <woId> -> find the loaded JS chunk(s) containing the inline part row and save them to scratchpad/b/<env>/
import {sess,post} from './common.mjs'; import fs from 'fs';
const E=process.env.ENV==='prod'?'prod':'b'+(process.env.TICKET); const s=await sess(); const p=s.page; const wo=process.argv[2];
if(process.env.ENV==='prod'){ const ws=(await s.api('/api/staff/my-workplaces')).json.data; const W=(ws.collection||ws).find(w=>/Trucks Hill 2/.test(w.name)); await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone}); }
await s.go('/workorders/'+wo+'/lines'); await p.waitForTimeout(4000); await p.locator('[data-test-id=button_add_part]').first().click(); await p.waitForTimeout(1500);
const urls=await p.evaluate(()=>performance.getEntriesByType('resource').map(e=>e.name).filter(u=>/\.js(\?|$)/.test(u)));
const dir='/tmp/claude-0/-home-user-Manual-test-Cases/82e9db23-9c28-5cfe-8eff-2ae5e2fa50c6/scratchpad/b/'+E; fs.mkdirSync(dir,{recursive:true});
for(const u of urls){ if(!/shopview.com/.test(u)) continue; const t=await p.evaluate(async u=>{try{return await (await fetch(u)).text()}catch(e){return ''}},u); if((t.includes('inline_part')||t.includes('next row'))){ const n=u.split('/').pop().split('?')[0]; fs.writeFileSync(dir+'/'+n,t); console.log('HIT',n,t.length); } }
await s.close(); process.exit(0);
