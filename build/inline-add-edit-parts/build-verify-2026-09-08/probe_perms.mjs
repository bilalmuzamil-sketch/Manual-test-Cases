import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const s=await boot('sv9315','/workorders','admin');
await s.page.waitForTimeout(6000);
const perms=await s.page.evaluate(()=>{
  let w=null; try{w=JSON.parse(localStorage.getItem('fe_permissions_wrapper')||'null');}catch(e){}
  const wd=w?.data??w; let fe=wd?.fe_permissions??wd?.fePermissions;
  const arr=Array.isArray(fe)?fe:(fe&&typeof fe==='object'?Object.keys(fe):[]);
  return {viewMode:wd?.view_mode??wd?.viewMode??wd?.template_slug, all:arr, fin:arr.filter(p=>/financ|cost|price|margin/i.test(String(p)))};
});
console.log('view/template:', perms.viewMode);
console.log('financial-related perms:', JSON.stringify(perms.fin));
console.log('total perms:', perms.all.length);
console.log('ALL:', JSON.stringify(perms.all));
await s.browser.close();
