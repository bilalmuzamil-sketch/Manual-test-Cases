// each: setup(s,env) -> {path,label,...}; optional action(s,ctx), ignore(hit,ctx)
const q=o=>new URLSearchParams(o).toString();
async function woWithParts(s,min=8){ const r=await s.api('/api/work-orders?'+q({'pagination[page]':1,'pagination[rowsPerPage]':100,'pagination[sortBy]':'companyName','pagination[descending]':false,search:'',showMyWorkOrders:0}));
  const w=(r.json?.data?.work_orders||[]).filter(x=>x.partRequestsCount>=min).sort((a,b)=>b.partRequestsCount-a.partRequestsCount)[0]; return w; }
export const SCEN={
  woParts:{ async setup(s){ const w=await woWithParts(s); return {path:`/workorders/${w.id}/part-requests`,label:`Work order ${w.number} → Parts tab (${w.partRequestsCount} parts)`,wo:w}; },
    ignore:(h,c)=>false },
};
