// each: setup(s,env) -> {path,label,...} | {skip}; optional action(s,ctx) (opens a dialog); fields = selectors whose
// final text is recorded so a blank-forever field can't pass silently
import fs from 'fs';
const q=o=>new URLSearchParams(o).toString();
const seed=env=>JSON.parse(fs.readFileSync(`/tmp/s10928/seed-${env}.json`,'utf8'));
export async function click(s,tid,{nth=0,prefix=false}={}){ const b=await s.page.evaluate(([t,n,pf])=>{ const els=[...document.querySelectorAll(pf?`[data-test-id^="${t}"]`:`[data-test-id="${t}"]`)].filter(e=>e.getBoundingClientRect().width>0);
  const e=els[n]; if(!e) return null; e.scrollIntoView({block:'center'}); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; },[tid,nth,prefix]);
  if(!b) throw new Error('not found '+tid); await s.page.mouse.click(b.x,b.y); return b; }
const WO={branch:'88207a22-4650-4b85-9d19-f7b0b9b7a1e7',prod:'0ecff689-f076-4b1e-be98-d1fcaf650988'};
async function firstId(s,path,pick){ const r=await s.api(path); const c=r.json?.data?.collection||r.json?.data||[]; const x=(Array.isArray(c)?c:[]).find(pick||(()=>true)); return x&&x.id; }
const VEND=['[data-test-id^="select_vendor_"]','[data-test-id^="select_category_"],[data-test-id^="select_part_request_category_"]'];
export const SCEN={
  woPartsApproved:{ async setup(s,env){ return {path:`/workorders/${WO[env]}/part-requests`,label:'Work order Parts tab (approved work order)'}; }, fields:VEND },
  psParts:{ async setup(s,env){ const r=await s.api('/api/part-sales?'+q({'pagination[page]':1,'pagination[rowsPerPage]':50,'pagination[sortBy]':'companyName','pagination[descending]':false,search:''}));
      const p=(r.json?.data?.partSales||[]).filter(x=>x.partRequestsCount>=3).sort((a,b)=>b.partRequestsCount-a.partRequestsCount)[0]; if(!p) return {skip:'no part sale with parts'};
      return {path:`/parts/part-sale/${p.id}/part-requests`,label:`Part sale ${p.number||''} Parts grid (${p.partRequestsCount} parts)`}; }, fields:VEND },
  deliveryEdit:{ async setup(s,env){ const id=await firstId(s,'/api/inventory/deliveries?limit=20',x=>x.vendor_id); return id?{path:`/parts/delivery/${id}`,label:'Vendor invoice → Edit'}:{skip:'no vendor invoice'}; },
    action:(s)=>click(s,'button_edit_delivery'), fields:['[data-test-id="delivery_vendor_select"]'] },
  poReceivePage:{ async setup(s,env){ const id=await firstId(s,'/api/inventory/orders?limit=50',x=>x.status==='ordered'&&x.vendor_id); return id?{path:`/accept-delivery/${id}`,label:'Purchase order → Receive (accept delivery page)'}:{skip:'no ordered PO'}; },
    fields:['.q-field__native','[data-test-id*="vendor"]'] },
  staffEdit:{ async setup(s,env){ return {path:'/administration/staff',label:'Staff → Edit Staff Member'}; },
    action:(s)=>click(s,'staff_edit_button'), fields:['.q-dialog .q-field__native,.q-dialog .q-field__control'] },
  customerNewWO:{ async setup(s,env){ return {path:`/customers/${seed(env).cid2}/work-orders`,label:'Customer with no contacts → New Work Order'}; },
    action:(s)=>click(s,'button_new_work_order'), fields:['.q-dialog .q-field__native,.q-dialog .q-field__control'] },
  customerNewPS:{ async setup(s,env){ return {path:`/customers/${seed(env).cid2}/part-sales`,label:'Customer with no contacts → Part Sales tab → New Part Sale'}; },
    action:(s)=>click(s,'button_new_part_sale'), fields:['.q-dialog .q-field__native,.q-dialog .q-field__control'] },
  inventoryNew:{ async setup(s,env){ return {path:'/parts/inventory',label:'Inventory → New Inventory Part'}; },
    action:(s)=>click(s,'button_new_inventory_part'), fields:['.q-dialog .q-field__native,.q-dialog .q-field__control'] },
  inventoryEdit:{ async setup(s,env){ return {path:'/parts/inventory',label:'Inventory → open a part (edit)'}; },
    action:(s)=>click(s,'table_cell_name_',{prefix:true}), fields:['.q-dialog .q-field__native,.q-dialog .q-field__control'] },
  timesheetEdit:{ async setup(s,env){ const cand={branch:['04ab678b-a2c2-4fd7-bcd9-76b6a23a419f'],prod:[]}[env];
      if(env==='prod'){ const r=await s.api('/api/work-orders?'+q({'pagination[page]':1,'pagination[rowsPerPage]':60,'pagination[sortBy]':'companyName','pagination[descending]':false,search:'',showMyWorkOrders:0}));
        for(const w of (r.json?.data?.work_orders||[])) cand.push(w.id); }
      for(const id of cand.slice(0,25)){ await s.page.goto(s.host.app+`/workorders/${id}/timesheets`,{waitUntil:'commit'}); await s.page.waitForTimeout(3500);
        if(await s.page.evaluate(()=>!!document.querySelector('[data-test-id="button_edit_timesheet"]'))) return {path:`/workorders/${id}/timesheets`,label:'Work order Timesheets → Edit Timesheet'}; }
      return {skip:'no work order with a timesheet found in 25'}; },
    action:(s)=>click(s,'button_edit_timesheet'), fields:['[data-test-id="select_timesheet_line"]','[data-test-id="select_timesheet_department"]','[data-test-id="select_timesheet_staff"]'] },
  receiveParts:{ async setup(s,env){ return {path:`/workorders/${WO[env]}/lines`,label:'Work order Lines → Receive (part awaiting receipt)'}; },
    action:async(s)=>{ const b=await s.page.evaluate(()=>{ const e=[...document.querySelectorAll('[data-test-id="button_part_request_action"]')].find(x=>/Receive/i.test(x.innerText)&&x.getBoundingClientRect().width>0); if(!e) return null; e.scrollIntoView({block:'center'}); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; }); if(!b) throw new Error('no Receive button'); await s.page.mouse.click(b.x,b.y); },
    fields:['.q-dialog .q-field'] },
  linesAddPart:{ async setup(s,env){ return {path:`/workorders/${WO[env]}/lines`,label:'Work order Lines → Add Part row'}; },
    action:(s)=>click(s,'button_add_part'), fields:['.q-dialog .q-field','tr .q-field'] },
  linesEditPart:{ async setup(s,env){ return {path:`/workorders/${WO[env]}/lines`,label:'Work order Lines → Edit Part'}; },
    action:(s)=>click(s,'button_edit_part_',{prefix:true}), fields:['.q-dialog .q-field'] },
  vehicleEdit:{ async setup(s,env){ const S=seed(env); return {path:`/customers/vehicle/${S.vid}/work-orders?companyId=${S.cid}`,label:'Asset with a Type → Edit Asset'}; },
    action:(s)=>click(s,'button_edit_vehicle'), fields:['.q-dialog .q-field'] },
};
