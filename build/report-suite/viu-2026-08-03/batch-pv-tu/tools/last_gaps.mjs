import { login, api } from './qa8582.mjs';
import fs from 'fs';
const t=await login('admin'); const S=t.sessCookie;
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a',LE='f8a8b802-7780-4b16-bf10-343caeb616b2';
const R={};
const get=q=>api(S,'GET','/api/reporting/reports/parts-velocity?'+q);
// A. S2-E1/E2/E3: a part with NO vendor must vanish when any Vendor filter is on
const base=`type=both&range=this_year&locations=${HD},${LE}&search=BRAKECLEAN&pagination[rowsPerPage]=20`;
const b=(await get(base)).body.data.collection;
R.brakecleanRows=b.map(x=>({pn:x.part_number,vendor:x.vendor,cat:x.category,loc:x.location}));
const vendors=(await api(S,'GET','/api/vendors?pagination[rowsPerPage]=5')).body?.data?.collection||[];
R.vendorProbe=vendors.slice(0,2).map(v=>({id:v.id,name:v.name}));
// find the vendor id for "Cuview Management" (the vendor on the LE BRAKECLEAN row)
const vAll=[]; let vp=1; while(vp<=8){const r=await api(S,'GET',`/api/vendors?pagination[page]=${vp}&pagination[rowsPerPage]=200`); const c=r.body?.data?.collection||[]; vAll.push(...c); if(c.length<200)break; vp++;}
const cuview=vAll.find(v=>/Cuview/i.test(v.name||''));
R.cuview=cuview?{id:cuview.id,name:cuview.name}:null;
if(cuview){ const withV=(await get(base+`&vendors=${cuview.id}`)).body.data.collection;
  R.vendorFilterOn={rows:withV.map(x=>({pn:x.part_number,vendor:x.vendor,loc:x.location})),
   nullVendorRowStillThere: withV.some(x=>!x.vendor)};}
// uncategorised parts vanish with a category filter on
const uncat=(await get(`type=both&range=this_year&locations=${HD},${LE}&categories=b25c5c04-fe8d-4c21-a15c-a02c69f1ee5d&pagination[rowsPerPage]=5`)).body.data.collection;
R.categoryFilterRows=uncat.map(x=>({pn:x.part_number,cat:x.category}));
const noCatAny=(await get(`type=both&range=this_year&locations=${HD},${LE}&pagination[rowsPerPage]=500`)).body.data.collection.filter(x=>!x.category);
R.rowsWithNoCategory=noCatAny.length;
const noCatWithFilter=uncat.filter(x=>!x.category).length;
R.noCategoryRowsUnderCategoryFilter=noCatWithFilter;
// B. Units Returned: are there part-return records in the window, and do they match?
const withRet=(await get(`type=both&range=this_year&locations=${HD},${LE}&pagination[rowsPerPage]=500&pagination[sortBy]=units_returned&pagination[descending]=true`)).body.data.collection;
R.topReturns=withRet.slice(0,6).map(x=>({pn:x.part_number,type:x.type,ret:x.units_returned,sold:x.units_sold,rev:x.revenue}));
const rets=await api(S,'GET','/api/returns?pagination[rowsPerPage]=10');
R.returnsEndpoint={status:rets.status, sample:(rets.body?.data?.collection||[]).slice(0,3).map(x=>({id:x.id,status:x.status,pn:x.part_number,q:x.quantity,date:x.created_at||x.date}))};
// C. reversal exclusion: find a reversed invoice and compare
R.reversalProbe={};
for(const p of ['/api/invoices?pagination[rowsPerPage]=5&status=reversed','/api/invoices?pagination[rowsPerPage]=5']){
  const r=await api(S,'GET',p); R.reversalProbe[p]={status:r.status, n:(r.body?.data?.collection||[]).length,
    statuses:[...new Set((r.body?.data?.collection||[]).map(x=>x.status))]};}
fs.writeFileSync('../evidence/pv/last-gaps.json',JSON.stringify(R,null,1));
console.log(JSON.stringify(R,null,1).slice(0,4500));
