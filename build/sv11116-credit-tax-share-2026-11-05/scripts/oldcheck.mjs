// usage: node oldcheck.mjs <range> <numRegex> -> report rows whose invoiceNumber matches regex: number, paid date, tax, creditTax, credits
import {sess} from './common.mjs'; const [R,RX]=process.argv.slice(2); const s=await sess(); await s.go('/workorders'); await s.page.waitForTimeout(1200);
const c=(await s.api(`/api/reporting/sales-tax-report?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=2000&dateRange=${R}&search=`)).json?.data?.collection||[];
console.log(JSON.stringify(c.filter(x=>new RegExp(RX).test(x.invoiceNumber)).map(x=>[x.invoiceNumber,x.customer,x.status,x.paidDate,x.tax,x.creditTax,x.credits]))); await s.close(); process.exit(0);
