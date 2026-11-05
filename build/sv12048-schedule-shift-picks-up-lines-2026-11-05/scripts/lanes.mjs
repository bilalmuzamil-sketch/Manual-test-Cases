import {sess} from './common.mjs'; const s=await sess({dpr:1}); const p=s.page; await s.go('/schedule'); await p.waitForTimeout(4500);
const vt=p.locator('[data-test-id="schedule_view_toggle"]').getByText('Day',{exact:true}); if(await vt.count()){ await vt.first().click(); await p.waitForTimeout(1500);}
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-resource-id]')].filter(e=>e.offsetParent||e.getClientRects().length).map(e=>e.tagName+' '+e.getAttribute('data-resource-id')+' '+(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,50)).filter((v,i,a)=>a.indexOf(v)===i).slice(0,40).join('\n')));
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id="schedule_lane_label"]')].map(e=>e.innerText.replace(/\s+/g,' ')).slice(0,30).join(' | ')));
await s.close(); process.exit(0);
