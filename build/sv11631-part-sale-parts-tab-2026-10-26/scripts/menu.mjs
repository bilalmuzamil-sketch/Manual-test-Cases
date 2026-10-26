import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2,scrollbars:true});
const p=s.page; console.log('mapping',JSON.stringify((await s.api('/api/bookkeeping/adjustment-item-mapping-status')).json));
const out={};
for(const [tag,id] of [['p2162','90a95f29-f405-4763-834d-6e3a237f8c33'],['p2109','48ba5757-175a-4701-8c4a-810791ac2ede']]){
 await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(6500);
 const rows=await p.evaluate(()=>[...document.querySelectorAll('.base-table tbody tr')].filter(r=>r.getBoundingClientRect().height>10).map((r,i)=>{const b=r.querySelector('.part-sale-utility-cell button:last-child, [data-test-id^=button_part_request_menu]'); return {i,ids:[...r.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/button|menu/.test(t)).map(t=>t.replace(/_[0-9a-f-]{36}.*/,'')).join(',')}}));
 out[tag]={rows:rows.slice(0,3)};
 // open the last-row kebab of row 0 (ellipsis button in utility cell)
 const kb=await p.evaluate(()=>{const r=[...document.querySelectorAll('.base-table tbody tr')].filter(r=>r.getBoundingClientRect().height>10)[0]; const btns=[...r.querySelectorAll('.part-sale-utility-cell button')]; const b=btns[btns.length-1]; const x=b.getBoundingClientRect(); return {id:b.getAttribute('data-test-id'),b:[x.x,x.y,x.width,x.height]}});
 await p.mouse.click(kb.b[0]+kb.b[2]/2,kb.b[1]+kb.b[3]/2); await p.waitForTimeout(1200);
 out[tag].kebab=kb.id; out[tag].menu=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.getBoundingClientRect().height>0).map(e=>(e.getAttribute('data-test-id')||'').replace(/_[0-9a-f-]{36}.*/,'')+':'+e.innerText.trim()));
 await p.keyboard.press('Escape'); await p.waitForTimeout(500);
}
console.log(JSON.stringify(out,null,1)); process.exit(0);
