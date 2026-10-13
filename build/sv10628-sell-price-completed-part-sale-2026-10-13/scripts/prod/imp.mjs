// impersonate a user in an open harness session: switch-user, then hydrate the SPA's own auth state
export async function impersonate(s, userId, workplace){
  const p=s.page;
  const sw=await s.api('/api/switch-user',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({user_id:userId})});
  if(workplace) await s.api('/api/iam/change-location',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({workplace_id:workplace.id,workplace_timezone:workplace.tz})});
  const fe=await s.api('/api/auth/me/fe-permissions');
  const u={data:{role:sw.json.data.role,details:sw.json.data.details}};
  await p.evaluate(([u,f,w])=>{ localStorage.setItem('user',JSON.stringify(u)); localStorage.setItem('fe_permissions_wrapper',JSON.stringify(f));
    if(w){ localStorage.setItem('location',JSON.stringify(w.id)); localStorage.setItem('timezone',JSON.stringify(w.tz)); } },[u,fe.json.data,workplace]);
  return {status:sw.status, perms:fe.json?.data?.fe_permissions||[]};
}
