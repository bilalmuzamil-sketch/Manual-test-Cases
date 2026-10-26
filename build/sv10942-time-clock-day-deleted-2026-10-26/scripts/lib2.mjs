export async function tday(s,tag){
  const t=(await s.api('/api/reporting/individual-punch-clock/today?range=today')).json.data.collection;
  const m=(await s.api('/api/reporting/individual-punch-clock/this_year?range=this_year')).json;
  const cur=(await s.api('/api/technician-tasks/my-current-task')).json.data.technician_task;
  const yc=m?.data?.collection||[];
  console.log(`[${tag}] today=${t.length} year=${yc.length} current=${cur&&cur.id?cur.id.slice(0,8)+' '+cur.start_date+' '+cur.label:'none'} :: today rows:`, JSON.stringify(t).slice(0,700));
  return {t,yc,cur};
}
