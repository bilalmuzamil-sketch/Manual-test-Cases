import {sess,post} from './common.mjs'; const s=await sess(); await s.go('/parts/vendors'); await s.page.waitForTimeout(1500);
const show=(n,r)=>console.log(n,r.status,JSON.stringify(r.json||r.text).slice(0,500));
show('addvendor{}',await post(s,'/api/parts-catalogue/add-vendor',{}));
const o=await s.api('/api/parts-catalogue/options'); console.log('opt',JSON.stringify(o.json).slice(0,300));
const p=await s.api('/api/inventory/parts?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=3&search=ZZ'); console.log('parts',JSON.stringify(p.json).slice(0,600));
show('ordcreate{}',await post(s,'/api/inventory/orders/create',{}));
show('accept{}',await post(s,'/api/inventory/orders/accept',{}));
show('paycreate{}',await post(s,'/api/parts-catalogue/vendor/payment/create',{}));
await s.close(); process.exit(0);
