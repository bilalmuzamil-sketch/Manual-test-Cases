import {sess} from './common.mjs'; const s=await sess(); const p=s.page; const caps=[];
p.on('response',async r=>{ if(r.request().method()!=='GET'&&/inspection-templates/.test(r.url())){ let b='';try{b=(await r.text()).slice(0,200)}catch{} caps.push(r.status()+' '+r.request().method()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' :: '+(r.request().postData()||'').slice(0,200)+' -> '+b);} });
const ids=async()=>p.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')+'='+(e.innerText||e.value||'').replace(/\s+/g,' ').slice(0,30)))].filter(x=>!/nav|clock|notif|profile|module|search|skip|global/.test(x)));
await s.go('/inspection-templates/new'); await p.waitForTimeout(7000); console.log('new',JSON.stringify(await ids()).slice(0,1500)); await p.screenshot({path:'../ev/branch-newtpl.png'});
const sc=p.locator('[data-test-id^="starter_library_scratch_"]').first(); if(await sc.count()){ await sc.click(); await p.waitForTimeout(4000); console.log('url',p.url()); console.log('after scratch',JSON.stringify(await ids()).slice(0,2000)); }
console.log('caps',JSON.stringify(caps)); await s.close(); process.exit(0);
