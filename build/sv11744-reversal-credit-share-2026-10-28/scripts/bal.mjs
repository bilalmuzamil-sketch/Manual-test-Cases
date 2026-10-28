import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,tag]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/s11744/seed-${env}-${tag}.json`,'utf8'));
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'11744',cookies,dir:(process.env.QA_DIR||'/tmp/qa23'),user:'bilal.muzamil@shopview.com'});
const acct=S.wos[0].inv.data.customer_account_id;
const r=await s.api(`/api/customer-account/list-unpaid-transaction?accountId=${acct}&pagination%5BrowsPerPage%5D=1000`);
const R=r.json.data.response; console.log(JSON.stringify(R.groupByDueDateData)); for(const t of R.collection) console.log(t.type,t.invoice_display_number||t.credit_display_number,t.amount,t.balance,t.status);
const v=await s.api(`/api/customers/view/${S.cid}`); console.log(JSON.stringify(v.json).match(/"[a-z_]*balance[a-z_]*":[^,]+/gi)?.join(' '));
await s.close();
