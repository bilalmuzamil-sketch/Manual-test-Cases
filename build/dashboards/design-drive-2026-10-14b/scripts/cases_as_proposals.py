"""Turn live case snapshots into the proposals shape design_label_check.py reads (preconditions + steps lines).
Usage: python3 -I cases_as_proposals.py <cases dir> <out json>"""
import json,glob,re,html,sys
def lines(s):
    s=html.unescape(re.sub(r'<br\s*/?>|</(?:p|li|div|tr|h\d)>','\n',str(s or ''))); s=re.sub(r'<[^>]+>','',s)
    return [x.strip() for x in s.split('\n') if x.strip()]
out=[]
for f in sorted(glob.glob(sys.argv[1]+'/C*.json')):
    j=json.load(open(f)); st=lines(j.get('custom_steps'))
    for x in j.get('custom_steps_separated') or []: st+=lines(x.get('content'))
    out.append({'key':'C%d'%j['id'],'preconds':lines(j.get('custom_preconds')),'steps':st})
json.dump({'new':out},open(sys.argv[2],'w'),ensure_ascii=False); print(len(out),'cases')
