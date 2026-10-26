import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const wo='f94beef2-ce77-4ec3-8d23-be8fb787348f';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:1000},dpr:2});
const P=async(p,b)=>s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const snap=(await s.api(`/api/invoices/${wo}/settings/view`)).json.data;
const sn=o=>({labor_rate:o.laborRate,labor_hours:o.laborHours,labor_cost:o.laborCost,part_number:o.partNumber,part_quantity:o.partQuantity,part_cost:o.partCost,part_description:o.partDescription,summarize_parts_total:o.summarizePartsTotal,summarize_labor_total:o.summarizeLaborTotal,disclaimer:o.disclaimer});
console.log('set all off',(await P(`/api/invoices/${wo}/settings/change`,sn({...snap,laborRate:false,laborHours:false,laborCost:false}))).status);
process.exit(0);
