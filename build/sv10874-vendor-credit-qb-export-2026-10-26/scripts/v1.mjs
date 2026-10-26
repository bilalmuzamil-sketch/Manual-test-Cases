import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:1});
await s.go('/workorders'); await s.page.waitForTimeout(3000);
for (const g of ['vendor','customer','journal_entry']){const r=await s.api(`/api/bookkeeping/unexported-items?filters[0][field]=groupName&filters[0][value]=${g}`); const c=r.json?.data?.collection||r.json?.data||[]; console.log('unexported',g,r.status,Array.isArray(c)?c.length:JSON.stringify(r.json).slice(0,200)); if(Array.isArray(c)) console.log(c.slice(0,8).map(x=>[x.typeLabel,x.number,x.customer,x.errorMessage,x.date].join(' | ')).join('\n'));}
const rr=await s.api('/api/inventory/returns'); const rc=rr.json?.data?.collection||rr.json?.data?.returns||rr.json?.data; console.log('returns',rr.status, Array.isArray(rc)?rc.length:JSON.stringify(rr.json).slice(0,300));
if(Array.isArray(rc)) console.log(rc.slice(0,12).map(x=>Object.entries(x).filter(([k,v])=>typeof v!=='object').map(([k,v])=>k+'='+String(v).slice(0,30)).join(' ').slice(0,400)).join('\n'));
process.exit(0);
