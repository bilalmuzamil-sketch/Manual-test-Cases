// Retest 28 Oct: R10 unblock — read the three QuickBooks signals; with arg "map" map Fee + Discount items.
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21'});
const ps=await s.api('/api/bookkeeping/products-and-services'); console.log('products-and-services',ps.status,JSON.stringify(ps.json).slice(0,500));
const it=await s.api('/api/bookkeeping/integration'); console.log('integration',it.status,JSON.stringify(it.json).slice(0,300));
fs.writeFileSync('/tmp/qa11631/integration-before.json',JSON.stringify(it.json));
const keys=JSON.stringify(it.json).match(/"(fee|discount)ItemId[^}]{0,200}/gi); console.log('fee/discount keys',keys);
process.exit(0);
