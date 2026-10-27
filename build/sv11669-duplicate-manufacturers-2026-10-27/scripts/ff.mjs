import {sess} from './lib.mjs'; const s=await sess(); const P=s.page; const req=[];
const r=await s.api('/api/organization/feature-flags?organization_id=d55bc308-e61a-438d-b5f1-c7a73c89d49f'); console.log(r.status,JSON.stringify(r.json).slice(0,200)); const a=Object.values(r.json?.data||{}).find(Array.isArray)||r.json?.data||[]; console.log('openapi',JSON.stringify((Array.isArray(a)?a:[]).filter(f=>/open/i.test(JSON.stringify(f)))));
P.on('request',q=>{if(q.method()!=='GET'&&/feature/.test(q.url())) req.push(q.method()+' '+q.url().split('/api')[1]+' '+q.postData());});
await s.go('/administration/feature-flags'); await P.waitForTimeout(3000);
console.log('page',await P.evaluate(()=>document.querySelector('.q-page')?.innerText.replace(/\n+/g,' | ').slice(0,600)));
const ids=await P.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.dataset.testId).filter(t=>/open|flag|toggle/i.test(t))); console.log('ids',ids.join(' | ').slice(0,600));
await P.screenshot({path:'../ev/ff-page.png',fullPage:true}); await s.browser.close(); process.exit(0);
