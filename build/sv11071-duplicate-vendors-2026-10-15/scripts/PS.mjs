import {op,ob,J,post} from './lib.mjs';
const env=process.argv[2]; const s=env==='prod'?await op():await ob(); const p=s.page;
await post(s,'/api/iam/change-location',env==='prod'?{workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'}:{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
await s.go('/parts/vendors'); await p.waitForTimeout(3500);
await p.locator('[data-test-id="page_search_toggle"]').click(); await p.waitForTimeout(500); await p.keyboard.type('Xtreme Driveline 11071',{delay:30}); await p.waitForTimeout(3500);
const rows=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent&&r.innerText.trim()).map(r=>{const b=r.getBoundingClientRect();return [r.innerText.replace(/\s+/g,' ').slice(0,100),[b.x,b.y,b.width,b.height].map(Math.round)]}));
console.log(env,'rows',J(rows,1200)); await p.screenshot({path:`ev/${env}-search-xtreme.png`}); await s.close();
