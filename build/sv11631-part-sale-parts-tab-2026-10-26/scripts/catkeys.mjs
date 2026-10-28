import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21'});
const r=(await s.api('/api/work-orders/2e2d8a27-b7a8-493e-878a-e8757c652ac2/parts/list-requests-by-line?search=')).json;
console.log((JSON.stringify(r).match(/"[a-z_]*categ[a-z_]*":[^,]{0,80}/gi)||[]).slice(0,6).join('\n'));
const c=(await s.api('/api/parts-catalogue/categories')).json; console.log('cats',JSON.stringify(c).slice(0,600)); process.exit(0);
