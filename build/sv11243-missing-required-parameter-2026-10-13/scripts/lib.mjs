import {open} from './qa.mjs'; import fs from 'fs';
export const op=(o={})=>open(Object.assign({env:'prod',dir:'/tmp/qa11243',user:'bilal.muzamil@shopview.com',pw:fs.readFileSync('/tmp/qa10142prod/pw.txt','utf8').trim(),vp:{width:1600,height:1000},dpr:2},o));
export const J=(x,n=400)=>String(JSON.stringify(x)).slice(0,n);
export const post=(s,u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
export const TH2={id:'b617914c-16e9-4485-8e8b-193cd86aa416',tz:'Africa/Accra'};
export const setLoc=async(s,l=TH2)=>{ await post(s,'/api/iam/change-location',{workplace_id:l.id,workplace_timezone:l.tz}); await s.page.evaluate(l=>{localStorage.setItem('location',JSON.stringify(l.id)); localStorage.setItem('timezone',JSON.stringify(l.tz));},l); };
