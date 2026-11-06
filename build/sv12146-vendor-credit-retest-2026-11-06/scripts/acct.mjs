// node acct.mjs <vendorId> -> vendor balance, unpaid list (raw), payments list (raw)
import {sess} from './common.mjs'; const s=await sess(); await s.go('/parts/vendors'); await s.page.waitForTimeout(1500); const vid=process.argv[2];
const v=(await s.api('/api/parts-catalogue/vendor/'+vid)).json.data.vendor; console.log('balance',v.balance,'acct',v.vendor_account_id);
const q='?accountId='+v.vendor_account_id+'&pagination%5BrowsPerPage%5D=1000&pagination%5BsortBy%5D=date&pagination%5Bdescending%5D=true';
console.log('UNPAID',JSON.stringify((await s.api('/api/parts-catalogue/vendor/transactions/list-unpaid-by-vendor-account'+q)).json).slice(0,800));
console.log('PAYMENTS',JSON.stringify((await s.api('/api/parts-catalogue/vendor/payment/list-by-vendor-account'+q)).json).slice(0,2500));
await s.close(); process.exit(0);
