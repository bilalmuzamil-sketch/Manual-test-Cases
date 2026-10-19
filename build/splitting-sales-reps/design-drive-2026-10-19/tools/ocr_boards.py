import sys,os,subprocess,glob,csv,io
from PIL import Image
D=sys.argv[1]; out=D+'/ocr'; tmp=sys.argv[2]
for f in sorted(glob.glob(D+'/unpacked/png/*.png')):
    base=os.path.basename(f)[:-4]
    im=Image.open(f).convert('RGB'); sc=1 if im.width<1000 else 2
    im2=im.resize((im.width*sc*1,im.height*sc*1),Image.LANCZOS) if sc>1 else im
    t=f'{tmp}/{base}.png'; im2.save(t)
    tsv=subprocess.run(['tesseract',t,'-','--psm','11','tsv'],capture_output=True,text=True).stdout
    os.remove(t)
    rows=list(csv.DictReader(io.StringIO(tsv),delimiter='\t',quoting=csv.QUOTE_NONE))
    lines={}
    for r in rows:
        if r['level']!='5' or not r['text'].strip() or float(r['conf'])<30: continue
        k=(r['block_num'],r['par_num'],r['line_num'])
        x,y=int(r['left'])//sc,int(r['top'])//sc
        L=lines.setdefault(k,{'x':x,'y':y,'w':[]}); L['w'].append(r['text'])
    with open(f'{out}/{base}.txt','w') as o:
        for L in sorted(lines.values(),key=lambda L:(L['y']//8,L['x'])):
            o.write(f"{L['x']:5d},{L['y']:5d}  {' '.join(L['w'])}\n")
    print(base,len(lines))
