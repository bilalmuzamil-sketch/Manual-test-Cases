var DSX = (function(){
const parse = s => { const o = []; s.split(';').forEach(p => { const i = p.indexOf(':'); if (i > 0) o.push([p.slice(0,i).trim(), p.slice(i+1).trim()]); }); return o; };
const get = (o,k) => { const e = o.find(x => x[0]===k); return e ? e[1] : undefined; };
const px = v => v && /^\d+(\.\d+)?px$/.test(v) ? parseFloat(v) : NaN;
const KEEP = new Set(['width','min-width','max-width','flex','flex-shrink','flex-grow','flex-basis','margin','margin-top','margin-bottom','margin-left','margin-right','align-self','justify-self','position','top','left','right','bottom','z-index','grid-column','grid-row','order','text-decoration','transform']);
const keep = (o, extra) => o.filter(([k]) => KEEP.has(k) || (extra && extra.has(k))).map(([k,v]) => k+':'+v).join(';');
function tagEnd(s, start, tag){ const re = new RegExp('<'+tag+'\\b|</'+tag+'>','g'); re.lastIndex = start; let d = 0, m; while ((m = re.exec(s))) { if (m[0][1] === '/') { d--; if (d === 0) return re.lastIndex; } else d++; } return -1; }
const CHECK_SVG = '<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.5 5.2 3.9 7.5 8.5 2.5"/></svg>';
const TONES = [[/success-(fill|50|25)\b/,'success'],[/warning-(fill|50|25)\b/,'warning'],[/(error|danger)-(fill|50|25)\b/,'danger'],[/(primary-(25|50|100)|info-fill)\b/,'info'],[/(grey-(25|50|100)|surface-sunken)\b/,'neutral'],[/cat-teal-fill/,'teal']];
const withClass = (attrs, cls, style) => { let a = attrs.replace(/\s+style="[^"]*"/,''); a = a.replace(/\s+class="([^"]*)"/, (m,c)=>{ cls = c+' '+cls; return ''; }); return ' class="'+cls+'"'+(style?' style="'+style+'"':'')+a; };
function run(t){
  const st = {btnP:0,btnS:0,btnD:0,iconBtn:0,badge:0,badgeSkip:0,check:0,radio:0,toggle:0,toggleWarn:0,tip:0,card:0,modal:0,menu:0,alert:0,tab:0};
  const out = []; let i = 0;
  const re = /<(a|span|button|div|label)\b([^>]*)>/g; let m;
  while ((m = re.exec(t))) {
    const [full, tag, attrs] = m; const sm = attrs.match(/\sstyle="([^"]*)"/);
    if (!sm || /\sclass="[^"]*sv-/.test(attrs)) continue;
    const s = sm[1], o = parse(s); const bg = get(o,'background')||'', col = get(o,'color')||'', h = px(get(o,'height')), w = px(get(o,'width')), br = get(o,'border-radius')||'', bd = get(o,'border')||'';
    let rep = null, endAt = -1;
    // toggle (whole element)
    if (tag==='span' && w>=34 && w<=44 && h>=18 && h<=24 && br==='9999px') {
      const e = tagEnd(t, m.index, 'span'); const inner = t.slice(m.index+full.length, e-7);
      if (/^<span style="width:1[6-9]px;height:1[6-9]px;border-radius:9999px/.test(inner)) {
        const on = get(o,'justify-content')==='flex-end'; if (/warning/.test(bg)) st.toggleWarn++;
        rep = '<button type="button" role="switch" aria-checked="'+on+'" class="sv-toggle'+(on?' is-on':'')+'"'+(keep(o)?' style="'+keep(o)+'"':'')+'><span class="sv-toggle__thumb"></span></button>'; endAt = e; st.toggle++;
      }
    }
    // checkbox
    if (!rep && tag==='span' && w===h && w>=14 && w<=18 && /^[345]px$/.test(br) && !/cat-/.test(bg) && !get(o,'font-size')) {
      const e = tagEnd(t, m.index, 'span'); const checked = /var\(--sv-accent\)/.test(bg);
      rep = '<span role="checkbox" aria-checked="'+checked+'" class="sv-check'+(checked?' is-checked':'')+'"'+(keep(o)?' style="'+keep(o)+'"':'')+'>'+(checked?CHECK_SVG:'')+'</span>'; endAt = e; st.check++;
    }
    // radio
    if (!rep && tag==='span' && w===h && w>=14 && w<=18 && (br==='9999px'||br==='50%') && /solid/.test(bd)) {
      const e = tagEnd(t, m.index, 'span'); const checked = /^[3-6]px solid var\(--sv-accent\)/.test(bd);
      rep = '<span role="radio" aria-checked="'+checked+'" class="sv-radio'+(checked?' is-checked':'')+'"'+(keep(o)?' style="'+keep(o)+'"':'')+'>'+(checked?'<span class="sv-radio__dot"></span>':'')+'</span>'; endAt = e; st.radio++;
    }
    // info tooltip: span with title + cursor:help wrapping only an svg
    if (!rep && tag==='span' && /\stitle="/.test(attrs) && get(o,'cursor')==='help') {
      const e = tagEnd(t, m.index, 'span'); const inner = t.slice(m.index+full.length, e-7);
      if (/^<svg[\s\S]*<\/svg>$/.test(inner)) {
        const tip = attrs.match(/\stitle="([^"]*)"/)[1];
        rep = '<span class="sv-tt-host" style="color:var(--sv-text-muted);flex:none;cursor:help'+(keep(o)?';'+keep(o):'')+'">'+inner+'<span class="sv-tt-pop sv-tt-pop--top" role="tooltip"><span class="sv-tt-wrap sv-tt-wrap--arrow-bottom"><span class="sv-tt"><span class="sv-tt__sub">'+tip+'</span></span><span class="sv-tt__arrow"></span></span></span></span>';
        endAt = e; st.tip++;
      }
    }
    if (!rep && (tag==='a'||tag==='span'||tag==='button') && h>=28 && h<=44 && br!=='9999px') {
      const isP = bg==='var(--sv-accent)' && /^(#fff|#FFF|#ffffff|var\(--sv-(text-on-accent|accent-on-solid)\))$/.test(col);
      const isD = /var\(--sv-(error|danger)(-600|-500)?\)/.test(bg) && /^(#fff|var\(--sv-(text-on-accent|accent-on-solid)\))$/.test(col);
      const isS = bd==='1px solid var(--sv-border-strong)' && (!bg || bg==='var(--sv-surface)') && /^(500|600)$/.test(get(o,'font-weight')||'') && /flex/.test(get(o,'display')||'');
      if (isP||isD||isS) {
        if (w && w===h) { st.iconBtn++; }
        else { const v = isP?'primary':isD?'danger':'secondary'; st[isP?'btnP':isD?'btnD':'btnS']++;
          rep = '<'+tag+withClass(attrs, 'sv-btn sv-btn--'+v+(h<=32?' sv-btn--sm':''), keep(o, new Set(['width']))) + '>'; }
      }
    }
    // tab (asset tab bar)
    if (!rep && (tag==='a'||tag==='span') && get(o,'height')==='32px' && get(o,'padding')==='0 12px' && br==='6px' && get(o,'font-size')==='14px') {
      const sel = /surface-hover|grey-100|grey-50/.test(bg) || /text-primary|grey-900/.test(col);
      rep = '<'+tag+withClass(attrs,'sv-tab',keep(o))+' role="tab" aria-selected="'+sel+'">'; st.tab++;
    }
    // badge
    if (!rep && (tag==='span'||tag==='a') && br==='9999px' && /^1[0-2]px$/.test(get(o,'font-size')||'') && ((h>=16&&h<=24)||/^(2px|1px) /.test(get(o,'padding')||''))) {
      const tone = (TONES.find(([r]) => r.test(bg))||[])[1];
      if (tone) { const sm2 = get(o,'font-size')==='10px' || (h && h<=18); rep = '<'+tag+withClass(attrs,'sv-badge sv-badge--'+tone+(sm2?' sv-badge--sm':''),keep(o))+'>'; st.badge++; }
      else st.badgeSkip++;
    }
    // containers
    if (!rep && tag==='div' && get(o,'background')==='var(--sv-surface)' && br==='12px') {
      const sh = get(o,'box-shadow')||'';
      const extra = new Set(['padding','overflow','display','flex-direction','gap','align-items','justify-content','grid-template-columns','height','box-sizing','max-height','min-height']);
      let k = keep(o, extra);
      if (/0 20px 24px|0 12px 24px/.test(sh)) { if (!get(o,'overflow')) k += (k?';':'')+'overflow:visible'; rep = '<div'+withClass(attrs,'sv-modal',k)+'>'; st.modal++; }
      else if (/^1px solid var\(--sv-border-default\)$/.test(bd) && !/12px 24px/.test(sh)) { if (!get(o,'overflow')) k += (k?';':'')+'overflow:visible'; rep = '<div'+withClass(attrs,'sv-card sv-card--flush',k)+'>'; st.card++; }
    }
    if (!rep && tag==='div' && br==='8px' && /0 4px 8px rgba\(11,23,51,0\.08\)/.test(get(o,'box-shadow')||'')) {
      const extra = new Set(['padding','overflow','display','flex-direction','gap','height','box-sizing','max-height']);
      let k = keep(o, extra); if (!get(o,'padding')) k += (k?';':'')+'padding:0'; if (!get(o,'gap')) k += ';gap:0'; if (!get(o,'display')) k += ';display:block';
      rep = '<div'+withClass(attrs,'sv-menu',k)+'>'; st.menu++;
    }
    if (!rep && tag==='div' && br==='8px' && /-(fill|50)\)$/.test(bg) && /^1px solid var\(--sv-(success|warning|error|danger|primary|info)-(border|300|200)\)$/.test(bd)) {
      const tone = /success/.test(bg)?'success':/warning/.test(bg)?'warning':/(error|danger)/.test(bg)?'danger':'info';
      rep = '<div'+withClass(attrs,'sv-alert sv-alert--'+tone,keep(o,new Set(['width','flex-direction'])))+'>'; st.alert++;
    }
    if (rep) { out.push(t.slice(i, m.index), rep); i = endAt > 0 ? endAt : m.index + full.length; re.lastIndex = i; }
  }
  out.push(t.slice(i));
  let r = out.join('');
  r = r.split('background:rgba(15,17,26,0.5)').join('background:var(--sv-scrim)');
  r = r.replace(/<div style="([^"]*?)gap:2px">(?=<(?:span|a) class="sv-tab")/g, (m,a)=>{ st.tabs=(st.tabs||0)+1; return '<div class="sv-tabs" role="tablist" style="'+a+'">'; });
  r = modalParts(r, st);
  r = r.replace('<link rel="stylesheet" href="_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/colors_and_type.css">', '<link rel="stylesheet" href="_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/colors_and_type.css">\n  <link rel="stylesheet" href="_ds/shopview-design-system-fac6efcf-a972-4c02-96a5-def12ed8b037/components.css">');
  r = r.replace('a:hover { color: var(--sv-accent); }', 'a:not(.sv-btn):not(.sv-tab):hover { color: var(--sv-accent); }');
  return { r, st };
}
function divEnd(s,start){ return tagEnd(s,start,'div'); }
function kids(s){ const out=[]; let i=0; while(i<s.length){ while(i<s.length && /\s/.test(s[i])) i++; if(i>=s.length) break; const tm=s.slice(i).match(/^<(div|span|a|label|button|x-import|dc-import)\b/); if(!tm) return null; const e=tagEnd(s,i,tm[1]); if(e<0) return null; out.push([i,e]); i=e; } return out; }
function modalParts(r, st){
  let pos=0; st.mHead=0; st.mFoot=0;
  while((pos=r.indexOf('<div class="sv-modal"',pos))>=0){
    const oe=r.indexOf('>',pos)+1, e=divEnd(r,pos); let inner=r.slice(oe,e-6); const ks=kids(inner);
    if(ks && ks.length>=2){
      const [fs,fe]=ks[ks.length-1]; let foot=inner.slice(fs,fe);
      const fm=foot.match(/^<div style="([^"]*)">/);
      if(fm && /sv-btn/.test(foot) && /display:flex/.test(fm[1])){ const o=parse(fm[1]); const split=get(o,'justify-content')==='space-between'; const k=keep(o, new Set(['background'])); foot='<div class="sv-modal__footer'+(split?' sv-modal__footer--split':'')+'"'+(k?' style="'+k+'"':'')+'>'+foot.slice(fm[0].length); inner=inner.slice(0,fs)+foot+inner.slice(fe); st.mFoot++; }
      const [hs,he]=ks[0]; let head=inner.slice(hs,he); const hm=head.match(/^<div style="([^"]*)">/);
      if(hm && /border-bottom:1px solid/.test(hm[1])){ const o=parse(hm[1]); const col=get(o,'flex-direction')==='column'; let k=keep(o); if(col) k+=(k?';':'')+'height:auto;flex-direction:column;align-items:flex-start;justify-content:center;gap:'+(get(o,'gap')||'2px');
        head='<div class="sv-modal__header"'+(k?' style="'+k+'"':'')+'>'+head.slice(hm[0].length);
        head=head.replace(/<span style="font-size:1[6-8]px;line-height:2[4-8]px;font-weight:600;color:var\(--sv-grey-900\)">/, '<span class="sv-modal__title">'); inner=inner.slice(0,hs)+head+inner.slice(he); st.mHead++; }
      r=r.slice(0,oe)+inner+r.slice(e-6);
    }
    pos=oe;
  }
  return r;
}
return { run };
})();
