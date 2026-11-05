// usage: node findold.mjs <range> [max=80] -> for old report rows with tax>0: WO -> company -> customer account -> payment list; prints the first rows whose payment includes a credit memo
import {sess} from './common.mjs'; const [R,MX]=process.argv.slice(2); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200);
const c=((await s.api(`/api/reporting/sales-tax-report?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=2000&dateRange=${R}&search=`)).json?.data?.collection||[]).filter(x=>x.tax>0&&!/ZZAUTOTEST SV11116/.test(x.customer));
const seen=new Set(); let n=0, found=0;
for(const x of c){ if(n>=Number(MX||80)||found>=2) break; const v=(await s.api('/api/work-orders/view/'+x.workOrderId)).json?.data; const w=v?.work_order||v; const co=w?.company_id||w?.company?.id; if(!co||seen.has(co)) continue; seen.add(co); n++;
 const cv=(await s.api('/api/customers/view/'+co)).json?.data; const acc=cv?.company?.customer_account_id||cv?.customer_account_id||cv?.company?.customerAccountId||JSON.stringify(cv).match(/"customer_account_id":"([0-9a-f-]{36})"/)?.[1]; if(!acc) continue;
 const pl=(await s.api(`/api/customer-payment/list?accountId=${acc}&pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=200`)).json; const rows=pl?.data?.collection||pl?.data?.response?.collection||[];
 for(const r of rows){ const ac=r.applied_credit_memos||[]; if(ac.length){ const st=(r.payment_statements||[]).map(z=>z.invoice_number||z.work_order_display_number||z.work_order_number).filter(Boolean); found++; console.log('HIT payment',r.id,r.payment_date||r.date,'credits',JSON.stringify(ac).slice(0,250),'invoices',JSON.stringify(st).slice(0,200),'customer',x.customer,'company',co); break; } } }
console.log('checked customers',n); await s.close(); process.exit(0);
