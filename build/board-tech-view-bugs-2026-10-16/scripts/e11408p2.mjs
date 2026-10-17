import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa11310',vp:{width:1440,height:900},dpr:2}); const p=s.page;
const w=await s.api('/api/staff/my-workplaces'); console.log(JSON.stringify(w.json).slice(0,800));
await s.go('/workorders'); await p.waitForTimeout(3000); console.log('current',await p.evaluate(()=>document.querySelector('[data-test-id=profile_menu_button]')?.innerText.replace(/\s+/g,' ')));
for(const t of ['estimate','work_order','completed','all']){ const r=await s.api(`/api/work-orders?pagination[page]=1&pagination[limit]=1&filters[0][field]=status&filters[0][value]=${t}`); console.log(t,r.status,JSON.stringify(r.json?.data?.pagination||r.json?.data?.total||Object.keys(r.json?.data||{})).slice(0,200)); }
await s.close();
