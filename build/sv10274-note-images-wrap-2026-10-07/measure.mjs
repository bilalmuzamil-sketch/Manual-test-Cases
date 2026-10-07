import fs from 'fs'; import {ob,j} from './lib.mjs';
// node measure.mjs <path> <noteId> <label> <w> <h> [env=branch|prod]
const [path,note,label,W,H]=process.argv.slice(2);
const s=await ob({vp:{width:+W,height:+H},dpr:2}); const P=s.page;
await s.go(path); await P.waitForTimeout(2500);
const sel=`[data-test-id="note_card_${note}"]`;
await P.waitForSelector(sel,{timeout:20000}); await P.evaluate(s=>document.querySelector(s).scrollIntoView({block:'start'}),sel); await P.waitForTimeout(800);
const m=await P.evaluate(([sel])=>{
 const R=e=>{const r=e.getBoundingClientRect();return [r.left,r.top,r.right,r.bottom].map(x=>Math.round(x));};
 const card=document.querySelector(sel); const atts=[...card.querySelectorAll('[data-test-id^="note_attachment_card_"]')];
 const ar=atts.map(R); const rows=[...new Set(ar.map(r=>r[1]))].length; const maxRight=Math.max(...ar.map(r=>r[2]));
 const btn=card.querySelector('[data-test-id="button_note_actions"]'); const br=R(btn);
 const cx=(br[0]+br[2])/2, cy=(br[1]+br[3])/2; const hit=document.elementFromPoint(cx,cy); const onTop=!!hit&&(btn===hit||btn.contains(hit));
 const scrollers=[...document.querySelectorAll('*')].filter(e=>e.scrollWidth>e.clientWidth+1&&['auto','scroll'].includes(getComputedStyle(e).overflowX)).map(e=>({tag:e.tagName,cls:(e.className+'').slice(0,40),sw:e.scrollWidth,cw:e.clientWidth,containsNote:e.contains(card)}));
 const de=document.documentElement;
 return {vw:innerWidth,vh:innerHeight,docSW:de.scrollWidth,docCW:de.clientWidth,bodySW:document.body.scrollWidth,card:R(card),nAtt:atts.length,rows,maxRight,btn:br,btnInViewport:br[0]>=0&&br[2]<=innerWidth,btnInCard:br[2]<=R(card)[2],btnOnTop:onTop,scrollers};
},[sel]);
await P.screenshot({path:`/tmp/qa9667b/shots/${label}.png`});
// menu
let bb=await P.locator(sel+' [data-test-id="button_note_actions"]').boundingBox(); await P.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await P.waitForTimeout(900);
m.menu=await P.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return e.innerText.trim()+(r.right<=innerWidth&&r.left>=0?'':'(OFFSCREEN)');}));
await P.screenshot({path:`/tmp/qa9667b/shots/${label}-menu.png`});
await P.keyboard.press('Escape'); await P.waitForTimeout(600);
// viewer
const th=P.locator(sel+' [data-test-id^="note_attachment_card_"]').first(); const tb=await th.boundingBox(); await P.mouse.click(tb.x+30,tb.y+tb.height/2); await P.waitForTimeout(2000);
m.viewer=await P.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog, [role=dialog]')].filter(e=>e.offsetParent||e.getBoundingClientRect().width>0); const im=d.length?d[d.length-1].querySelector('img'):null; return {dialogs:d.length,img:im?{src:(im.getAttribute('src')||'').slice(0,80),w:im.naturalWidth,h:im.naturalHeight}:null,text:d.length?d[d.length-1].innerText.replace(/\n+/g,' | ').slice(0,120):''};});
await P.screenshot({path:`/tmp/qa9667b/shots/${label}-viewer.png`});
m.marker=await P.evaluate(()=>document.querySelector('meta[name="app-version"]')?.content); m.at=new Date().toISOString(); m.label=label;
fs.writeFileSync(`/tmp/qa9667b/shots/${label}.json`,JSON.stringify(m,null,1));
console.log(label,'vw',m.vw,'docSW',m.docSW,'att',m.nAtt,'rows',m.rows,'maxRight',m.maxRight,'card',m.card[2],'btn',j(m.btn),'inVP',m.btnInViewport,'onTop',m.btnOnTop,'menu',j(m.menu),'scrollers',j(m.scrollers.filter(x=>x.containsNote||x.tag==='HTML'||x.tag==='BODY'),200),'viewer',j(m.viewer,160),m.marker);
await s.close();
