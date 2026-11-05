// usage: node oldrows.mjs <range> -> report rows count, how many have credits, and lists rows NOT ours (customer not ZZAUTOTEST SV11116) with paidDate
import {sess} from './common.mjs'; const [R]=process.argv.slice(2); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200);
const d=(await s.api(`/api/reporting/sales-tax-report?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=2000&dateRange=${R}&search=`)).json?.data; const c=d.collection||[];
const ours=c.filter(x=>/ZZAUTOTEST SV11116/.test(x.customer)); const oth=c.filter(x=>!/ZZAUTOTEST SV11116/.test(x.customer));
console.log(R,'rows',c.length,'ours',ours.length,'others',oth.length,'others with credits',oth.filter(x=>(x.credits||[]).length).length,'others creditTax>0',oth.filter(x=>x.creditTax>0).length);
console.log('sample others',JSON.stringify(oth.slice(0,4).map(x=>[x.invoiceNumber,x.status,x.paidDate,x.tax,x.creditTax]))); await s.close(); process.exit(0);
