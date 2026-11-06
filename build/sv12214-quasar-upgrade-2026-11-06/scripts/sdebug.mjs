import {sess,post} from './common.mjs'; const s=await sess({vp:{width:1600,height:900}}); const p=s.page;
await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
await s.go('/schedule'); await p.waitForTimeout(5000); await p.locator('[data-test-id=schedule_view_toggle]').getByText('Day',{exact:true}).first().click(); await p.click('[data-test-id=button_schedule_today]'); await p.waitForTimeout(3500);
await p.screenshot({path:'../ev/staging-r3-sched-day.png'}); console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id=schedule_shift_block]')].map(e=>{const r=e.getBoundingClientRect(); return [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height),e.innerText.replace(/\s+/g,' ').slice(0,60)]}))));
console.log(await p.evaluate(()=>{const ids=[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id').replace(/[0-9a-f-]{36}/,'<id>')))]; return ids.filter(x=>/shift|book|event|block|range|date/i.test(x)).join(' ')}));
await s.close(); process.exit(0);
