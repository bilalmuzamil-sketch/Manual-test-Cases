import {ob,j} from './lib.mjs';
const s=await ob(); let all=[];
for(let pg=1;pg<=15;pg++){ const r=await s.api(`/api/work-orders?page=${pg}&limit=100&rowsPerPage=100`); const w=r.json?.data?.work_orders||[]; all=all.concat(w); if(w.length<100) break; }
const st={}; all.forEach(w=>st[w.status]=(st[w.status]||0)+1); console.log('n',all.length,j(st,400));
const rv=all.filter(w=>/review/i.test(w.status)); console.log('review',rv.length);
const stuck=[]; for(const w of rv){ const v=await s.api('/api/work-orders/lines/'+w.id); const ls=v.json?.data?.lines||v.json?.data?.collection||v.json?.data||[]; const arr=Array.isArray(ls)?ls:[]; const pend=arr.filter(l=>/authorization_required/.test(l.status)); if(pend.length) stuck.push(w.number+' pending '+pend.length+' of '+arr.length); if(!arr.length && rv.indexOf(w)===0) console.log('lines shape',v.status,j(v.json,300)); }
console.log('stuck',stuck.length,j(stuck,800)); await s.close();
