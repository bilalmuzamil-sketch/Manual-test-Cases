// Retest 28 Oct: why are Category boxes taller on the work order Parts tab? Inspect one box on an env.
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,wo]=process.argv.slice(2);
const s=env==='branch'?await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900}})
 : await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900}});
const p=s.page; await s.go(`/workorders/${wo}/part-requests`); await p.waitForTimeout(7000);
console.log(env,JSON.stringify(await s.marker()));
const r=await p.evaluate(()=>[...document.querySelectorAll('tbody td')].filter(td=>[...td.querySelectorAll('.q-field__label')].some(l=>l.innerText.trim()==='Category')).slice(0,3).map(td=>{
  const c=td.querySelector('.q-field__control'), n=td.querySelector('.q-field__native'); const cs=getComputedStyle(n);
  return {ctrlH:Math.round(c.getBoundingClientRect().height),nativeH:Math.round(n.getBoundingClientRect().height),w:Math.round(c.getBoundingClientRect().width),
   text:JSON.stringify(n.innerText), html:n.innerHTML.replace(/\s+/g,' ').slice(0,300), ws:cs.whiteSpace, flexWrap:cs.flexWrap, minH:cs.minHeight,
   kids:[...n.children].map(k=>k.tagName+'.'+(k.className||'').toString().slice(0,40)+'['+Math.round(k.getBoundingClientRect().width)+'x'+Math.round(k.getBoundingClientRect().height)+']')}}));
console.log(JSON.stringify(r,null,1)); process.exit(0);
