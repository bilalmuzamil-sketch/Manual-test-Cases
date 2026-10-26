import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,ps,tag]=process.argv.slice(2); const widths=(process.argv[5]||'1440,1024,768,390').split(',').map(Number);
const OUT=`/tmp/qa11631/w/m-${env}-${tag}/`; fs.mkdirSync(OUT,{recursive:true});
const s=env==='branch'?await open({env:'branch',ticket:'11631',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2,scrollbars:true})
 : await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa21',vp:{width:1440,height:900},dpr:2,scrollbars:true});
const p=s.page; console.log('marker',JSON.stringify(await s.marker()));
const res={};
for(const w of widths){
  await p.setViewportSize({width:w,height:w<500?844:(w<900?1024:900)});
  await s.go(`/parts/part-sale/${ps}/part-requests`); await p.waitForTimeout(6500);
  await p.evaluate(()=>document.querySelectorAll('.q-notification').forEach(n=>n.remove()));
  const m=await p.evaluate(()=>{
    const R=e=>{if(!e)return null;const r=e.getBoundingClientRect();return [Math.round(r.x*10)/10,Math.round(r.y*10)/10,Math.round(r.width*10)/10,Math.round(r.height*10)/10]};
    const t=[...document.querySelectorAll('table.q-table')].sort((a,b)=>b.querySelectorAll('tr').length-a.querySelectorAll('tr').length)[0]; if(!t) return {none:true};
    const wrap=t.closest('.q-table__middle')||t.parentElement; const wr=wrap.getBoundingClientRect();
    const cs=e=>getComputedStyle(e);
    const ths=[...t.querySelectorAll('thead th')].map(th=>{const c=cs(th); const tx=th.innerText.trim(); let txtBox=null; if(tx){const rng=document.createRange(); rng.selectNodeContents(th); const rr=rng.getBoundingClientRect(); txtBox=[rr.x,rr.width];}
      return {t:tx,b:R(th),pos:c.position,left:c.left,right:c.right,bl:c.borderLeftWidth+' '+c.borderLeftStyle+' '+c.borderLeftColor,shadow:c.boxShadow,txt:txtBox,cls:th.className.slice(0,80)}});
    const rows=[...t.querySelectorAll('tbody tr')].filter(r=>r.getBoundingClientRect().height>10).map(tr=>{
      const cells=[...tr.querySelectorAll('td')].map(td=>{ const cls=(td.className.match(/[\w-]+-cell/)||[''])[0]; const c=cs(td);
        const f=td.querySelector('.q-field'); const lab=td.querySelector('.q-field__label'); const ctrl=td.querySelector('.q-field__control');
        const inp=td.querySelector('input.q-field__native, textarea'); const selTxt=td.querySelector('.q-field__native > span, .q-field__native .ellipsis, .q-field__native');
        let text='',clip=false,ell='';
        if(f&&f.classList.contains('q-select')){ const n=td.querySelector('.q-field__native'); const sp=[...n.children].find(x=>x.tagName!=='INPUT')||n; text=(sp.innerText||'').trim()||(inp&&inp.value)||''; clip=sp.scrollWidth>sp.clientWidth+0.5; ell=cs(sp).textOverflow; }
        else if(inp){ text=inp.value; clip=inp.scrollWidth>inp.clientWidth+0.5; ell=cs(inp).textOverflow; }
        else { const e=td.querySelector('.ellipsis')||td; text=td.innerText.trim(); clip=e.scrollWidth>e.clientWidth+0.5; ell=cs(e).textOverflow; }
        const pre=td.querySelector('.q-field__prefix'); const suf=td.querySelector('.q-field__suffix');
        return {cls,b:R(td),pos:c.position,field:f?(f.classList.contains('q-select')?'select':'input'):null,fh:ctrl?Math.round(ctrl.getBoundingClientRect().height):null,
          label:lab?(lab.innerText.trim()+(lab.getBoundingClientRect().height>0?'':' (hidden)')):null,text,clip,ell,pre:pre?pre.innerText.trim():'',suf:suf?suf.innerText.trim():'',title:td.querySelector('[title]')?.getAttribute('title')||'',
          arrow:!!td.querySelector('.q-select__dropdown-icon'),outlined:f?f.classList.contains('q-field--outlined'):null};});
      return {h:Math.round(tr.getBoundingClientRect().height*10)/10,cells};});
    const sb={overflowX:cs(wrap).overflowX,sw:wrap.scrollWidth,cw:wrap.clientWidth,scrollbarH:wrap.offsetHeight-wrap.clientHeight-parseFloat(cs(wrap).borderTopWidth)-parseFloat(cs(wrap).borderBottomWidth)};
    const shadows=[]; for(const e of [wrap,...wrap.querySelectorAll('th,td')]){ for(const pse of [null,'::before','::after']){ const c=getComputedStyle(e,pse); const bs=c.boxShadow; const bg=c.backgroundImage; if((bs&&bs!=='none')||(pse&&bg&&bg!=='none'&&c.content!=='none')){ const k=(e.className||'').toString().match(/[\w-]+-cell|q-table__middle|base-table/)?.[0]||e.tagName; shadows.push(k+(pse||'')+' '+(bs!=='none'?bs:bg).slice(0,90)); } } }
    const act=ths.find(h=>h.t==='Actions'); const vis=act?ths.filter(h=>h.t&&h.t!=='Actions'&&h.b[0]>=wr.x-1&&h.b[0]+h.b[2]<=act.b[0]+1).map(h=>h.t):[];
    return {wrap:[wr.x,wr.width],sb,ths,rows,docW:document.documentElement.scrollWidth,vw:innerWidth,shadows:[...new Set(shadows)],visibleBeforeActions:vis};});
  res[w]=m; await p.screenshot({path:`${OUT}w${w}.png`,fullPage:false});
  console.log(w,'table',m.sb.sw,'/',m.sb.cw,'scrollbarH',m.sb.scrollbarH,'rows',m.rows?.length,'heights',[...new Set(m.rows?.map(r=>r.h))].join(','),'headers',m.ths?.map(h=>h.t).filter(Boolean).join('|'),'\n   visible before Actions:',m.visibleBeforeActions?.join('|'),'\n   shadows:',m.shadows?.join(' ; '),'docW',m.docW,'vw',m.vw);
}
fs.writeFileSync(OUT+'m.json',JSON.stringify(res,null,1)); process.exit(0);
