// Reads the issued invoice's own date fields and the work order's finance tab date, to compare with the report's InvoiceDate.
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const LOC='b3c8c820-f815-4cf1-8938-10956c5ee71a', INV=process.argv[2]||'2ebae06f-5602-4945-8ca4-d1a22740610c', WO=process.argv[3]||'99e6423d-3b81-4a2a-803f-5b22d7b04f86', SHOT=process.argv[4]||'ev/finance-tab.png';
const s=await open({env:'staging',ticket:'staging',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:process.env.QA_DIR||'/tmp/qa30',user:'bilal.muzamil@shopview.com',quick:'admin',vp:{width:1440,height:900}});
const p=s.page; await s.go('/workorders'); await p.evaluate(L=>localStorage.setItem('location',JSON.stringify(L)),LOC);
const v=JSON.stringify((await s.api(`/api/invoices/${INV}/view`,{headers:{'x-location-id':LOC}})).json); console.log('invoice view',(v.match(/"[a-zA-Z_]*(date|Date|created|due)[a-zA-Z_]*":"?[^,"]*/g)||[]).slice(0,15).join(' '));
await s.go(`/workorders/${WO}/finance`); await p.waitForTimeout(6000);
console.log('finance text',(await p.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').match(/.{0,60}(Invoice Date|Date|Oct \d+, 2026|10\/2\d\/2026).{0,60}/g)?.slice(0,6))));
await p.screenshot({path:SHOT});
await s.close(); process.exit(0);
