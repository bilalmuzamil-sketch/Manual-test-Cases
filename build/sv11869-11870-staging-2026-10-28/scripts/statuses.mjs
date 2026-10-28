import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'staging',ticket:'x',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:process.env.QA_DIR||'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin'});
const LOC='b3c8c820-f815-4cf1-8938-10956c5ee71a'; await s.go('/workorders'); await s.page.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC);
const st=await s.api('/api/work-orders/statuses',{headers:{'x-location-id':LOC}}); console.log('statuses',JSON.stringify(st.json).slice(0,700));
for(const v of ['estimate','approved','in_progress','ready_for_review','complete','invoiced','paid']){ const r=await s.api(`/api/work-orders?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=5&pagination%5BsortBy%5D=createdAt&pagination%5Bdescending%5D=true&filters%5B0%5D%5Bfield%5D=status&filters%5B0%5D%5Bvalue%5D=${v}&search=ZZ11870`,{headers:{'x-location-id':LOC}}); const w=r.json?.data?.work_orders||[]; console.log(v,r.status,w.length,w.slice(0,3).map(x=>[x.display_number||x.number,x.invoice_number,x.status,x.created_at||x.start_date].join('|')).join(' ; ')); }
await s.close(); process.exit(0);
