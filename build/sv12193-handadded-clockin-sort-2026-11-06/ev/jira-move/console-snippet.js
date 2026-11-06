// Paste into the browser console while signed in on https://sv12193.qa.shopview.com
const API = 'https://sv12193api.qa.shopview.com';
const FROM = 'PASTE-ID-OF-WORK-ORDER-1';   // the work order that has the open time entry
const TO   = 'PASTE-ID-OF-WORK-ORDER-2';   // the work order to move it to
const get = u => fetch(API + u, { credentials: 'include' }).then(r => r.json());
const list = d => Array.isArray(d) ? d : d.collection;
const entry = list((await get(`/api/technician-tasks/list?pagination[rowsPerPage]=100&pagination[page]=1&filters[0][field]=work_order&filters[0][value]=${FROM}&search=`)).data).find(e => !e.end_date);
const line = list((await get('/api/work-orders/lines/' + TO)).data)[0].line_id;
const r = await fetch(API + '/api/technician-tasks/move', { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: entry.id, work_order_id: TO, line_id: line }) });
console.log('moved', entry.id, r.status, await r.text());
