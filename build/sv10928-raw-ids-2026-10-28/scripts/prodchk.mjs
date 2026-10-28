import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'prod',ticket:'10928',cookies:{},dir:(process.env.QA_DIR||'/tmp/qa25'),user:'bilal.muzamil@shopview.com'});
const r=await s.api('/api/work-orders/lines/0ecff689-f076-4b1e-be98-d1fcaf650988'); console.log(r.status,JSON.stringify(r.json||r.text).slice(0,300));
await s.go('/workorders'); await s.page.waitForTimeout(3000); console.log('loc',await s.page.evaluate(()=>localStorage.getItem('location')));
await s.close(); process.exit(0);
