import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; const seen=[]; p.on('request',r=>{ const u=r.url(); if(/api\/(reporting|reports|aging|staff\/my)/.test(u)) seen.push(r.method()+' '+decodeURIComponent(u.replace(/^https:\/\/[^/]+/,''))); });
console.log('marker',JSON.stringify(await s.marker()));
for(const r of (process.env.R||'ar-aging-detail,ar-aging-collection,ar-aging-summary,ap-aging-detail,ap-aging-summary,ap-unpaid-invoices').split(',')){ await s.go('/reports/'+r); await p.waitForTimeout(6000); }
console.log([...new Set(seen)].join('\n').slice(0,4000)); await s.close(); process.exit(0);
