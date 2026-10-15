import {ob,J,post} from './lib.mjs'; import fs from 'fs';
const s=await ob(); const p=s.page; await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
let all=[]; for(let pg=1;pg<=60;pg++){ const d=(await s.api(`/api/parts-catalogue/vendors?pagination%5Bpage%5D=${pg}&pagination%5BrowsPerPage%5D=100&pagination%5BsortBy%5D=&pagination%5Bdescending%5D=false&search=`)).json?.data; const c=(d?.collection||[]).map(v=>v.name); all=all.concat(c); if(c.length<100) break; }
const cmp=(a,b)=>a.localeCompare(b,undefined,{sensitivity:'base'}); const bad=all.map((n,i)=>i>0&&cmp(all[i-1],n)>0?[all[i-1],n]:null).filter(Boolean);
const zz=all.map((n,i)=>[i,n]).filter(([i,n])=>/ZZAUTOTEST (Xtreme|Other|Rapid)/.test(n)); console.log('all vendors',all.length,'| out-of-order pairs',bad.length,J(bad.slice(0,3)),'| my vendors at',J(zz.map(([i,n])=>[i,n,all[i-1],all[i+1]]),800));
// M14: choose a sort on screen, reload
const R=[]; p.on('request',r=>{ if(/vendors\?|preferences/.test(r.url())) R.push(r.method()+' '+decodeURIComponent(r.url().replace(/.*\/api/,'/api')).slice(0,170)+(r.method()!=='GET'?' :: '+(r.postData()||'').slice(0,150):'')); });
await s.go('/parts/vendors'); await p.waitForTimeout(3500);
const th=p.locator('thead th').filter({hasText:/^City/}); console.log('city header',await th.count()); await th.first().click(); await p.waitForTimeout(2500);
const after1=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent&&r.innerText.trim()).slice(0,4).map(r=>r.innerText.split('\t').slice(0,6).join(' | ')));
await p.screenshot({path:'ev/M14-1-sorted-city.png'}); R.push('--- reload ---'); await p.reload(); await p.waitForTimeout(4500);
const after2=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent&&r.innerText.trim()).slice(0,4).map(r=>r.innerText.split('\t').slice(0,6).join(' | ')));
const hdr=await p.evaluate(()=>[...document.querySelectorAll('thead th')].map(t=>t.innerText.trim()+(t.className.includes('sorted')?' [sorted '+(t.className.includes('desc')?'desc':'asc')+']':'')));
await p.screenshot({path:'ev/M14-2-after-reload.png'});
console.log('after clicking City',J(after1,500),'\nafter reload',J(after2,500),'\nheaders',J(hdr),'\nrequests',J(R,1500));
const pref=(await s.api('/api/users/me/preferences/parts-vendors')).json; console.log('preference now',J(pref,300));
fs.writeFileSync('vs.json',JSON.stringify({count:all.length,bad,zz,after1,after2,hdr,R,pref},null,1)); await s.close();
