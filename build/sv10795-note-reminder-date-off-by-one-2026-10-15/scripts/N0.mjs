import {ob,J,post} from './lib.mjs';
const s=await ob({tz:'America/New_York'}); const p=s.page;
const wl=(await s.api('/api/work-orders?pagination[rowsPerPage]=5&pagination[page]=1&tab=open')).json; console.log('wo list keys',J(Object.keys(wl?.data||{}),200));
const rows=wl?.data?.collection||wl?.data?.workOrders||[]; console.log('wos',J(rows.slice(0,3).map(w=>[w.id||w.work_order_id,w.number||w.display_number||w.work_order_number,w.status]),400));
const wo=rows[0]?.id||rows[0]?.work_order_id; await s.go('/workorders/'+wo+'/notes'); await p.waitForTimeout(4500); console.log('url',p.url());
const tids=async()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+'|'+(e.innerText||e.value||'').trim().replace(/\s+/g,' ').slice(0,30)));
console.log('notes tids',J((await tids()).filter(x=>!/nav|clock|notif|profile|module|skip|global/.test(x)),2000)); await p.screenshot({path:'ev/N0-notes.png'});
await s.close();
