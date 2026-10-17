import {session,toView} from './rec.mjs';
const s=await session({quick:'tech',vp:{width:1440,height:900},dpr:1}); const p=s.page;
for(const q of ['4 Star','Pamill','Lamkin','Vuchester','Windy']){
 await s.go('/workorders?tab=all&search='+encodeURIComponent(q)); await p.waitForTimeout(4500); await toView(p,'tech_view'); await p.waitForTimeout(2000);
 const g=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=tech_view_group_name_]')].map(e=>e.closest('tr').innerText.replace(/\s+/g,' ').trim()).filter(t=>!/ 0 0 work/.test(t)));
 console.log(q, JSON.stringify(g).slice(0,600));
}
await s.close();
