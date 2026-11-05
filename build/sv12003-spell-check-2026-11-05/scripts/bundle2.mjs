import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; await s.go('/workorders'); await p.waitForTimeout(2500);
const W={id:JSON.parse(fs.readFileSync('/tmp/sv12003/seed-branch-s1.json','utf8')).wo};
await s.go('/workorders/'+W.id+'/lines'); await p.waitForTimeout(3000); await s.go('/customers/6a7b6afc-084d-4584-aacb-773bcd71cbcd'); await p.waitForTimeout(3000); await s.go('/workorders/'+W.id+'/lines'); await p.waitForTimeout(3000);
const urls=await p.evaluate(()=>performance.getEntriesByType('resource').map(e=>e.name).filter(u=>/\.js(\?|$)/.test(u)));
const res=await p.evaluate(async({urls,pats})=>{ const r={}; for(const pt of pats) r[pt]=[]; for(const u of urls){ try{ const t=await (await fetch(u)).text(); for(const pt of pats){ const re=new RegExp('.{0,160}'+pt+'.{0,160}','g'); for(const m of (t.match(re)||[]).slice(0,4)) r[pt].push(u.split('/').pop()+' :: '+m); } }catch(e){} } return r; },{urls,pats:['customer_note','vehicle_note','asset_note','edit_note','Edit Notes','Customer Note','Vehicle Note','setSelectionRange=']});
console.log('js files',urls.length); for(const k in res) console.log(k,res[k].length); fs.writeFileSync('/tmp/sv12003/bundle3.json',JSON.stringify(res,null,1)); await s.close(); process.exit(0);
