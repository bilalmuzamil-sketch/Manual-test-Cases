import {open} from '../../testing-tools/qa-session.mjs';
const s=await open({env:'prod',ticket:'10928',cookies:{},dir:(process.env.QA_DIR||'/tmp/qa25'),user:'bilal.muzamil@shopview.com'});
const r=await s.api('/api/iam/change-location',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:'b617914c-16e9-4485-8e8b-193cd86aa416',workplace_timezone:'Africa/Accra'})}); console.log('change-location',r.status);
await s.go('/workorders'); await s.page.evaluate(()=>localStorage.setItem('location',JSON.stringify('b617914c-16e9-4485-8e8b-193cd86aa416'))); await s.page.reload(); await s.page.waitForTimeout(3000);
console.log('loc',await s.page.evaluate(()=>localStorage.getItem('location')), (await s.api('/api/work-orders/lines/0ecff689-f076-4b1e-be98-d1fcaf650988')).status);
await s.close(); process.exit(0);
