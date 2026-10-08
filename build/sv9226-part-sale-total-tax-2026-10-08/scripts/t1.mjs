import {ob,j} from './lib.mjs';
const s=await ob({dpr:2,vp:{width:1600,height:1000},quick:'tech'}); const p=s.page;
const me=(await s.api('/api/auth/me/fe-permissions')).json?.data; const who=(await s.api('/api/iam/view-profile/')).json?.data?.user?.email;
console.log('who',who,'view',me?.view_mode,'SFD',(me?.fe_permissions||[]).filter(x=>/financ|sfd|seeFin/i.test(x)));
for(const path of ['/parts/part-sales','/customers/91067a7e-46e1-4019-8e40-ff436abcc4cc/part-sales']){ await s.go(path); await p.waitForTimeout(3000);
 const hs=await p.evaluate(()=>[...document.querySelectorAll('thead th')].map(t=>t.innerText.trim().replace('arrow_drop_up',''))); console.log(path,'url',p.url(),'headers',j(hs));
 await p.screenshot({path:`/tmp/qa9226/tech-${path.includes('customers')?'customer':'list'}.png`}); }
await s.close();
