// set-up: add an inventory part request (not yet picked) to a line of the work order; print the line and part ids
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,wo,lineNo]=process.argv.slice(2);
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'10928',cookies,dir:(process.env.QA_DIR||'/tmp/qa24'),user:'bilal.muzamil@shopview.com'});
const post=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const lines=(await s.api(`/api/work-orders/lines/${wo}`)).json?.data?.collection||[];
const L=lines.find(l=>String(l.line_number||l.number)===String(lineNo))||lines.find(l=>/authori|approved/i.test(l.status||''));
const inv=await s.api('/api/inventory/parts?'+new URLSearchParams({'pagination[page]':1,'pagination[rowsPerPage]':50,search:''}));
const parts=inv.json?.data?.collection||inv.json?.data?.parts||[]; const P=parts.find(x=>(+x.available_quantity||+x.quantity||+x.qty||0)>=2)||parts[0];
console.log('inventory keys',Object.keys(P||{}).slice(0,30).join(','));
const r=await post('/api/work-orders/part/make-request',{work_order:wo,line:L.line_id,description:P.name||P.description,part_number:P.part_number,quantity:1,part_source_type:'inventory',is_authorized:true,part_category_id:P.part_category_id||P.category_id,inventory_part_id:P.id,sell_price:+P.sell_price||10});
console.log('line',L.line_id,L.line_number,'part',P.id,P.part_number,'make',r.status,JSON.stringify(r.json).slice(0,250));
await s.close();
