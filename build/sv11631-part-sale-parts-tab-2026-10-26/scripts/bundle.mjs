// Retest 28 Oct: read the deployed code around a test id (env, partSaleId, needle).
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const [ENV,PS,NEEDLE]=process.argv.slice(2);
const s=ENV==='branch'?await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21'}):await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21'});
const p=s.page; if(process.argv[5]) await p.addInitScript(o=>{window.ONLY=o},process.argv[5]); await s.go(`/parts/part-sale/${PS}/part-requests`); await p.waitForTimeout(6000);
const r=await p.evaluate(async(n)=>{ const urls=[...new Set(performance.getEntriesByType('resource').map(e=>e.name).filter(u=>/\.js(\?|$)/.test(u)&&(!window.ONLY||u.includes(window.ONLY))))]; const out=[];
  for(const u of urls){ let t=""; try{ t=await (await fetch(u)).text(); }catch(e){ continue; } let i=t.indexOf(n); while(i>=0&&out.length<6){ out.push(u.split('/').pop()+' :: '+t.slice(Math.max(0,i-900),i+300)); i=t.indexOf(n,i+1);} } return {n:urls.length,out}; },NEEDLE);
console.log('scripts',r.n); r.out.forEach(x=>console.log('-----\n'+x)); process.exit(0);
