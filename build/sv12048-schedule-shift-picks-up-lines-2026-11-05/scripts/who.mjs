import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${process.argv[2]}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(5000);
const r=await p.evaluate(async()=>{ const urls=[...new Set(performance.getEntriesByType('resource').map(e=>e.name).filter(u=>/\/api\//.test(u)&&!/\.js/.test(u)))]; const out=[];
 for(const u of urls){ try{ const t=await (await fetch(u,{credentials:'include'})).text(); for(const nm of ['Cameron','Emily']){ const i=t.indexOf(nm); if(i>=0) out.push(nm+' @ '+u.replace(/^https?:\/\/[^/]+/,'')+' :: '+t.slice(Math.max(0,i-300),i+60)); } }catch(e){} } return out; });
console.log(r.join('\n\n')); await s.close(); process.exit(0);
