// usage: node wo.mjs <branch|prod>  -> headings of the work order Parts tab at 1440 for the first work order with parts
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const ENV=process.argv[2]; const rd=f=>fs.readFileSync('/tmp/sv11904/'+f,'utf8').trim();
const s=ENV==='prod'? await open({env:'prod',dir:'/tmp/qa42',user:'bilal.muzamil+serviceadvisornoreports@shopview.com',pw:fs.readFileSync('/tmp/sv-prod-pw2.txt','utf8').trim(),vp:{width:1440,height:900},dpr:2,scrollbars:true})
 : await open({env:'branch',ticket:'11904',cookies:{sv_sso_session:rd('sso'),PHPSESSID:rd('phpsess'),cf_clearance:rd('cfc')},quick:'admin',dir:'/tmp/qa41',vp:{width:1440,height:900},dpr:2,scrollbars:true});
const p=s.page; await s.go('/workorders'); await p.waitForTimeout(3000);
const loc=await p.evaluate(()=>document.querySelector('[data-test-id="profile_menu_button"]')?.innerText.split('\n')[0]);
const L=(await s.api('/api/work-orders?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=100&search=&showMyWorkOrders=0')).json.data; const rows=L.work_orders||L.collection||[];
const wo=rows.find(r=>(r.partRequestsCount||0)>=2)||rows.find(r=>r.unreceivedPartRequestsCount>0);
console.log(ENV,'loc',loc,'wo',wo?.number,'parts',wo?.partRequestsCount);
await s.go('/workorders/'+wo.id+'/part-requests'); await p.waitForTimeout(6000);
const th=await p.evaluate(()=>[...document.querySelectorAll('thead th')].filter(t=>t.getBoundingClientRect().width>0).map(t=>{const r=t.getBoundingClientRect(); const rg=document.createRange(); rg.selectNodeContents(t); return {t:t.innerText.trim().replace(/\n/g,' '),w:Math.round(r.width),h:Math.round(r.height),lines:new Set([...rg.getClientRects()].filter(x=>x.width>0).map(x=>Math.round(x.top))).size};}));
console.log('URL',p.url()); console.log('TH',JSON.stringify(th));
console.log('fees column?',th.some(t=>/Fees/.test(t.t)));
await p.screenshot({path:`/tmp/sv11904/m/wo-parts-${ENV}.png`});
fs.writeFileSync(`/tmp/sv11904/m/wo-parts-${ENV}.json`,JSON.stringify({wo:wo.number,th}));
await s.close(); process.exit(0);
