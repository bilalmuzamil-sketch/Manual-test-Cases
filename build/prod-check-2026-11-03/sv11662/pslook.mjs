import {prod1} from '../common.mjs'; const id=process.argv[2]; const s=await prod1('/tmp/qa75'); const p=s.page; await p.setViewportSize({width:1900,height:1100});
for(const t of ['part-requests','finance','']){ await s.go(`/parts/part-sale/${id}/${t}`); await p.waitForTimeout(6000); console.log(t||'root',p.url().slice(-40),(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+':'+e.innerText.trim().slice(0,20)).filter(x=>/portal|send|authoriz|approv/i.test(x)))).join(' | ')); }
await s.close(); process.exit(0);
