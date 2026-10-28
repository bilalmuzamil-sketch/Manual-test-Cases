// Retest 28 Oct: production control for N1 — pick the longest category on S2-889 row 1, then measure the Category box.
import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs';
const s=await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2});
const p=s.page; await s.go('/workorders/2e2d8a27-b7a8-493e-878a-e8757c652ac2/part-requests'); await p.waitForTimeout(7000);
const sel=p.locator('tbody td').filter({has:p.locator('.q-field__label',{hasText:'Category'})}).first().locator('.q-field__control');
await sel.click(); await p.waitForTimeout(1500);
const opts=await p.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].at(-1); const box=m; let all=new Set(); for(let i=0;i<40;i++){ m.querySelectorAll('.q-item').forEach(o=>all.add(o.innerText.trim())); box.scrollTop+=300; } return [...all];});
await p.waitForTimeout(500); const target=opts.filter(o=>o.length<=24).sort((a,b)=>b.length-a.length)[0]; console.log('options',opts.length,'picking',JSON.stringify(target));
await p.keyboard.type(target.slice(0,10)); await p.waitForTimeout(1500); await p.locator('.q-menu .q-item',{hasText:target}).first().click(); await p.waitForTimeout(3000);
const m=await p.evaluate(()=>[...document.querySelectorAll('tbody td')].filter(td=>[...td.querySelectorAll('.q-field__label')].some(l=>l.innerText.trim()==='Category')).map(td=>{const c=td.querySelector('.q-field__control'),n=td.querySelector('.q-field__native');return {h:Math.round(c.getBoundingClientRect().height),w:Math.round(c.getBoundingClientRect().width),text:n.innerText.trim(),kids:[...n.children].map(k=>Math.round(k.getBoundingClientRect().width))}}));
console.log(JSON.stringify(m)); await p.screenshot({path:'/tmp/qa11631/w/prod-wo-longcat.png'}); console.log(JSON.stringify(await s.marker())); process.exit(0);
