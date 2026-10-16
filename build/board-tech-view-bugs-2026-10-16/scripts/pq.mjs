import {session,toView} from './rec.mjs';
const s=await session({quick:process.argv[2],vp:{width:1440,height:900},dpr:1}); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(4500); await toView(p,'tech_view'); await p.waitForSelector('[data-test-id^=button_tech_view_pin_]'); await p.waitForTimeout(2000);
const L=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=button_tech_view_pin_]')].map(b=>({id:b.getAttribute('data-test-id').slice(21),name:document.querySelector(`[data-test-id=tech_view_group_name_${b.getAttribute('data-test-id').slice(21)}]`)?.innerText.trim(),dis:b.disabled||b.classList.contains('disabled'),aria:b.getAttribute('aria-label'),icon:b.querySelector('svg')?.getAttribute('data-icon')})));
console.log('total',L.length,'disabled',L.filter(x=>x.dis).length,'pinned',JSON.stringify(L.filter(x=>x.icon==='pin-off').map(x=>x.name)),'sample',JSON.stringify(L.slice(0,3)));
const f=L.find(x=>x.name==='Ahtsham Foreman'); console.log('foreman',JSON.stringify(f)); const t=await s.hoverTip('button_tech_view_pin_'+f.id); console.log('tip',JSON.stringify(t.tips.map(x=>x.text)));
await s.close();
