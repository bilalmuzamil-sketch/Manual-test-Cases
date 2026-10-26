import json,re,sys
for tag in sys.argv[1:]:
  m=json.load(open(f'm-branch-{tag}/m.json'))
  for w in ['1440','1024','768','390']:
    d=m[w]; ths=d['ths']; heads=[h['t'] for h in ths if h['t'] and h['t']!='more_vert']
    rows=d['rows']; issues=[]
    hs=set(r['h'] for r in rows); fhs=set(); labels=[]; clips=[]; desc_styles=set(); cost=[]; margin=[]; catv=[]
    for i,r in enumerate(rows):
      for c in r['cells']:
        k=c['cls']
        if c['fh']: fhs.add(c['fh'])
        if c['label'] and '(hidden)' not in c['label']: labels.append((i,k,c['label']))
        if k in ('part-number-cell','quantity-cell','cost-cell','core-charge-cell','sell-price-cell','margin-cell') and c['clip']: clips.append((i,k,c['text']))
        if k=='description-cell': desc_styles.add((c['field'],c['outlined'],c['fh'])); 
        if k=='cost-cell': cost.append(c['text'])
        if k=='margin-cell': margin.append(c['pre']+c['text']+c['suf'])
        if k in ('category-cell','vendor-cell'): catv.append((k[:3],c['text'],c['clip'],c['ell']))
    sticky=[h['t'] for h in ths if h['pos']=='sticky' and (h['right']!='auto' or h['left'] not in ('auto',))]
    a=[h for h in ths if h['t']=='Actions'][0]; cen=(a['txt'][0]+a['txt'][1]/2)-(a['b'][0]+a['b'][2]/2) if a['txt'] else None
    print(f"{tag} {w}: headers={'|'.join(heads)}")
    print(f"   row heights {hs} field heights {fhs} visible labels {labels[:3]} clipped money/number {clips[:4]}")
    print(f"   description styles {desc_styles}  | Actions sticky right={a['right']} width={a['b'][2]} header text centre offset={round(cen,1) if cen is not None else None} left-edge={a['shadow'][:40]}")
    print(f"   sticky headers: {[ (h['t'],h['left'],h['right']) for h in ths if h['pos']=='sticky' and not (h['left']=='auto' and h['right']=='auto')][:6]}")
    if w=='1440': print('   cost',cost,'\n   margin',margin,'\n   cat/vendor',catv)
