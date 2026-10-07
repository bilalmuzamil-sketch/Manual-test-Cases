import {ob,j} from './lib.mjs'; const s=await ob(); const p=s.page;
console.log(j(await s.marker()));
const rid='f3fff656-6c82-407e-b3a8-17f536358966'; const g=(await s.api('/api/roles/'+rid)).json.data; console.log('role keys',Object.keys(g).join(','),'cross',j(g.cross_toggles||g.crossToggles));
await s.go('/administration/roles'); await p.waitForTimeout(1500);
const rows=await p.evaluate(()=>[...document.querySelectorAll('tr,[data-test-id]')].filter(e=>/ZZ10323/.test(e.innerText||'')&&e.innerText.length<200).map(e=>(e.getAttribute('data-test-id')||e.tagName)+':'+e.innerText.replace(/\s+/g,' ').slice(0,90)).slice(0,8)); console.log(j(rows,800));
await s.shot('sfd0','shots'); await s.close();
