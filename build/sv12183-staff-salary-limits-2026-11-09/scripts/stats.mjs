import {sess} from './common.mjs'; const s=await sess(); const p=s.page;
const r=await s.api('/api/work-orders?pagination%5BrowsPerPage%5D=30&pagination%5Bpage%5D=1&status=in_progress'); const c=r.json?.data?.collection||[]; console.log('wos',c.length, c.slice(0,3).map(x=>x.number||x.id).join(','));
const wo=c[0]?.id; await s.go(`/workorders/${wo}/lines`); await p.waitForTimeout(4000);
await p.locator('.q-tab, a, [role=tab]',{hasText:/^Stats$/}).first().click(); await p.waitForTimeout(4000);
console.log((await p.evaluate(()=>document.querySelector('main,.q-page')?.innerText||document.body.innerText)).replace(/\s+/g,' ').slice(0,1500));
await p.screenshot({path:'/tmp/sv12183/stats.png'}); await s.close(); process.exit(0);
