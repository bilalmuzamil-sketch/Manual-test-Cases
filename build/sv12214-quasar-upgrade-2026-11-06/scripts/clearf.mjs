import {sess,post} from './common.mjs'; const s=await sess({vp:{width:1600,height:900}}); const p=s.page;
await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
await s.go('/workorders'); await p.waitForTimeout(4000); const b=p.getByText('Clear all filters',{exact:true}); if(await b.count()){ await b.first().click(); await p.waitForTimeout(3000); }
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=filter_chip_]')].map(e=>e.getAttribute('data-test-id')+'='+e.innerText.replace(/\s+/g,' ').trim()).join(' | ')));
console.log('pref',JSON.stringify((await s.api('/api/users/me/preferences/work-orders-list')).json?.data?.value).slice(0,300)); await s.close(); process.exit(0);
