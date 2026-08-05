import * as H from './h.mjs'; import fs from 'fs';
const MOB={viewport:{width:390,height:844},isMobile:true,hasTouch:true,dsf:3,
  userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'};
const {browser,page,netlog}=await H.open({...MOB,settle:14000});
const R={build:'v3.4.2-d00239b',when:new Date().toISOString(),tests:[]};
const chips=()=>page.evaluate(()=>[...document.querySelectorAll('.mobile-chip,[data-test-id^=filter_chip_]')].map(b=>b.innerText.trim().replace(/\n/g,'|')));
const cards=()=>page.evaluate(()=>{const t=document.body.innerText;
  const st=(t.match(/\n(Estimate|Approved|In Progress|In progress|Review|Complete|Invoiced|Paid|Declined|Imported)\n/g)||[]).map(s=>s.trim());
  const m=t.search(/No work orders|No results|no results found|nothing to show/i);
  return {statusCounts:st.reduce((a,b)=>(a[b]=(a[b]||0)+1,a),{}),n:(t.match(/S2-\d{4,6}/g)||[]).length,
   emptyText:m>=0?t.slice(Math.max(0,m-90),m+240):null};});
const reqs=()=>netlog.filter(n=>n.phase==='res'&&/\/api\/work-orders\?/.test(n.url)).map(n=>decodeURIComponent(n.url.split('?')[1]||''));
for(const u of ['?status=declined&tab=all','?status=paid&tab=all','?status=imported&tab=all']){
  const n0=reqs().length;
  await page.goto('https://sv8785.qa.shopview.com/workorders'+u,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(11000);
  const t={link:u,finalUrl:page.url(),chips:await chips(),cards:await cards(),
    apiCalls:reqs().slice(n0).map(q=>q.slice(0,190))};
  R.tests.push(t);
  await H.shot(page,'mob5-'+u.replace(/[^a-z]/g,''));
  console.log('LINK',u);
  console.log('  chips :',t.chips.join(' | '));
  console.log('  cards :',JSON.stringify(t.cards));
  console.log('  api   :',JSON.stringify(t.apiCalls.slice(0,3)));
}
// desktop control for the same link
await browser.close();
const D=await H.open({viewport:{width:1680,height:1050},settle:14000});
const n0=D.netlog.filter(n=>n.phase==='res'&&/work-orders\?/.test(n.url)).length;
await D.page.goto('https://sv8785.qa.shopview.com/workorders?status=declined&tab=all',{waitUntil:'domcontentloaded',timeout:60000});
await D.page.waitForTimeout(11000);
const dr=await D.page.evaluate(()=>{const tr=[...document.querySelectorAll('tbody tr')].filter(r=>r.querySelectorAll('td').length>3);
  const cell=(r,i)=>{const c=r.querySelectorAll('td');return c[i]?c[i].innerText.trim():'';};
  return {n:tr.length,statuses:[...new Set(tr.map(r=>cell(r,1)))],
    chips:[...document.querySelectorAll('button.filter-chip')].map(b=>b.innerText.trim().replace(/\n/g,'|'))};});
R.desktopControl={link:'?status=declined&tab=all',...dr,
  api:D.netlog.filter(n=>n.phase==='res'&&/work-orders\?/.test(n.url)).slice(n0).map(n=>decodeURIComponent(n.url.split('?')[1]||'').slice(0,190))};
console.log('DESKTOP control ?status=declined -> rows',dr.n,'statuses',JSON.stringify(dr.statuses));
console.log('  chips:',dr.chips.join(' | '));
console.log('  api  :',JSON.stringify(R.desktopControl.api.slice(0,3)));
fs.writeFileSync('/tmp/fv/obs/mob5-sharedlink.json',JSON.stringify(R,null,1));
await D.browser.close();
