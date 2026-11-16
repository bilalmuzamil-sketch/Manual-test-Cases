import {sess} from './common.mjs';
const s=await sess({dir:'/tmp/qa90'}); const p=s.page; const reqs=[];
p.on('request',r=>{const u=r.url(); if(u.includes('/api/reporting/')||u.includes('/api/') && u.includes('location')) reqs.push(r.method()+' '+u.slice(0,400));});
console.log('marker',JSON.stringify(await s.marker()));
for(const rep of ['ar-aging-detail','ar-aging-collection']){ await s.go('/reports/'+rep); await p.waitForTimeout(5000); }
const ids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')+'|'+(e.innerText||'').slice(0,40).replace(/\n/g,' ')).filter(x=>/filter|location|customer|select|more|menu/i.test(x)).slice(0,40));
console.log(reqs.join('\n')); console.log(ids.join('\n'));
await s.close(); process.exit(0);
