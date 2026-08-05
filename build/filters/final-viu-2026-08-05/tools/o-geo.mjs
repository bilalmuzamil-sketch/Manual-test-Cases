import * as H from './h.mjs'; import fs from 'fs';
const {browser,page}=await H.open({settle:16000});
await page.goto('https://sv8785.qa.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(12000);
const cf=page.locator('[data-test-id="clear_filters"]'); if(await cf.count()){await cf.first().click({timeout:15000}).catch(()=>{});await page.waitForTimeout(4000);}
const g=await page.evaluate(()=>{
  const box=e=>{const r=e.getBoundingClientRect();return{x:Math.round(r.x),y:Math.round(r.y),r:Math.round(r.right),b:Math.round(r.bottom),w:Math.round(r.width),h:Math.round(r.height)};};
  const tabs=[...document.querySelectorAll('.q-tab,[role=tab]')].map(t=>({t:t.innerText.trim(),...box(t)}));
  const chips=[...document.querySelectorAll('button.filter-chip')].map(b=>({t:b.innerText.trim().replace(/\n/g,'|'),...box(b)}));
  const tabParent=(()=>{const a=document.querySelector('.q-tab,[role=tab]');let p=a;for(let i=0;i<4&&p;i++)p=p.parentElement;return null;})();
  // find the nearest common ancestor of the first tab and the first chip
  const t0=document.querySelector('.q-tab,[role=tab]'), c0=document.querySelector('button.filter-chip');
  const anc=e=>{const a=[];let p=e;while(p){a.push(p);p=p.parentElement;}return a;};
  let common=null;
  if(t0&&c0){const A=anc(t0),B=new Set(anc(c0)); common=A.find(x=>B.has(x));}
  const chain=(e,stop)=>{const out=[];let p=e;while(p&&p!==stop){out.push({tag:p.tagName,cls:(p.className||'').toString().slice(0,60),...box(p)});p=p.parentElement;}return out;};
  const toolbar=[...document.querySelectorAll('[data-test-id]')].filter(x=>/toggle_filter_bar|page_search_toggle|button_column_selection|create_work_order/i.test(x.getAttribute('data-test-id'))).map(x=>({id:x.getAttribute('data-test-id'),...box(x)}));
  return {tabs,chips,toolbar,
    commonAncestor: common? {tag:common.tagName,cls:(common.className||'').toString().slice(0,90),...box(common)}:null,
    tabChain: t0&&common? chain(t0,common):null, chipChain: c0&&common? chain(c0,common):null,
    VERTICAL_OVERLAP: tabs[0]&&chips[0]? !(chips[0].y>=tabs[0].b || chips[0].b<=tabs[0].y) : null,
    HORIZONTAL_OVERLAP: tabs[0]&&chips[0]? !(chips[0].x>=tabs[tabs.length-1].r || chips[chips.length-1].r<=tabs[0].x) : null};});
console.log('TABS  :',g.tabs.map(t=>`${t.t} x${t.x}-${t.r} y${t.y}-${t.b}`).join('  '));
console.log('CHIPS :',g.chips.map(c=>`${c.t.split('|')[0]} x${c.x}-${c.r} y${c.y}-${c.b}`).join('  '));
console.log('TOOLBAR:',g.toolbar.map(t=>`${t.id} x${t.x} y${t.y}-${t.b}`).join('  '));
console.log('VERTICAL_OVERLAP (chips share the tabs vertical band):',g.VERTICAL_OVERLAP);
console.log('HORIZONTAL_OVERLAP:',g.HORIZONTAL_OVERLAP);
console.log('COMMON ANCESTOR:',JSON.stringify(g.commonAncestor));
console.log('TAB  chain to ancestor:',JSON.stringify(g.tabChain));
console.log('CHIP chain to ancestor:',JSON.stringify(g.chipChain));
fs.writeFileSync('/tmp/fv/obs/geo.json',JSON.stringify(g,null,1));
await page.screenshot({path:'/tmp/fv/shots/desk-geo-full.png'});
await page.screenshot({path:'/tmp/fv/shots/desk-geo-crop.png',clip:{x:0,y:60,width:1680,height:180}});
await browser.close();
