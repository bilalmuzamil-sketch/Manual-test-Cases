import {sess,j} from './common.mjs'; const s=await sess();
const me=(((await s.api('/api/staff?pagination[rowsPerPage]=500')).json?.data?.collection)||[]).find(x=>x.email==='bilal.muzamil@shopview.com');
console.log(j({deps:me.departments,wp:me.defaultWorkplaceName,role:me.role_label,active:me.is_active,sales:me.is_sales_rep})); await s.close(); process.exit(0);
