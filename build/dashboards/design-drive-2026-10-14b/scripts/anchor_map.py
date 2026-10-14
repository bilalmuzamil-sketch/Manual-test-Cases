"""Map PRD anchors (S1-R1 ...) to the live cases citing them; flag case text that names design/spec items changed on 14 Oct.
Usage: python3 -I anchor_map.py <cases dir> <out json>"""
import json,glob,re,html,sys,collections
D,OUT=sys.argv[1],sys.argv[2]
cs={};own={};ttl={}
for f in glob.glob(D+'/C*.json'):
    j=json.load(open(f)); t=' '.join(str(j.get(k) or '') for k in ('title','custom_preconds','custom_steps','custom_expected','refs'))
    cs[j['id']]=re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',t))); own[j['id']]=j['created_by']; ttl[j['id']]=j['title']
anc=collections.defaultdict(set)
for i,t in cs.items():
    for a in re.findall(r'S\d+-[RNE]\d+[a-z]?',t): anc[a].add(i)
json.dump({'anchors':{a:sorted(v) for a,v in sorted(anc.items())},'owner':own,'title':ttl},open(OUT,'w'),indent=0)
for a in ['S3-N2','S4-R11a','S4-R11b','S5-R9','S5-N3','S6-R3a','S6-R8a','S7-R2a','S8-R5a','S8-N1a','S9-R9','S9-R10','S9-R11','S11-E2','S12-R6','S12-R7','S12-R8','S12-R9','S12-R10','S12-R11','S12-R12','S12-R13','S5-R14','S10-R1','S4-R18','S5-R15','S5-R10','S3-R1','S5-R3','S4-R1']:
    print(a, sorted(anc.get(a,[])))
