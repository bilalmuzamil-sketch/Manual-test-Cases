import json,sys,os,glob,copy,time
sys.path.insert(0,'.')
import jiralib as J

BLOCKS={}
for f in ['blocks-schedule.json','blocks-filters.json','blocks-reportsuite.json']:
    BLOCKS.update(json.load(open(f)))

def para(t): return {"type":"paragraph","content":[{"type":"text","text":t}]}
def build(paras):
    nodes=[{"type":"paragraph","content":[{"type":"text","text":" "}]}]
    nodes += [para(p) for p in paras]
    return nodes

LOG='../write-log.jsonl'
def already(k):
    if not os.path.exists(LOG): return False
    for l in open(LOG):
        r=json.loads(l)
        if r['key']==k and r['result']=='OK': return True
    return False

def one(k):
    pre=json.load(open(f'../snapshots/{k}.json'))
    pre_desc=pre['fields'].get('description')
    if pre_desc is None: return {'key':k,'result':'NO-DESC'}
    pre_content=pre_desc['content']
    if json.dumps(pre_desc).find('Where this expected behaviour comes from')>=0:
        return {'key':k,'result':'SKIP-HAS-BLOCK'}
    new_desc=copy.deepcopy(pre_desc)
    added=build(BLOCKS[k])
    new_desc['content']=list(pre_content)+added
    code,body=J.put(f'/rest/api/3/issue/{k}',{'fields':{'description':new_desc}}, out='/tmp/_w.json')
    if code not in ('204','200'):
        return {'key':k,'result':'HTTP-'+code,'body':str(body)[:400]}
    time.sleep(0.4)
    c2,post=J.issue(k, out=f'../post/{k}.json')
    if c2!='200': return {'key':k,'result':'REGET-'+c2}
    pf=post['fields']
    post_content=pf['description']['content']
    n=len(pre_content)
    head_match = json.dumps(post_content[:n],sort_keys=True)==json.dumps(pre_content,sort_keys=True)
    tail_match = json.dumps(post_content[n:],sort_keys=True)==json.dumps(added,sort_keys=True)
    # every other field byte-identical
    fdiff=[]
    for fld,v in pre['fields'].items():
        if fld in ('description','updated','lastViewed'): continue
        if json.dumps(v,sort_keys=True)!=json.dumps(pf.get(fld),sort_keys=True): fdiff.append(fld)
    ok = head_match and tail_match and not fdiff
    return {'key':k,'result':'OK' if ok else 'MISMATCH','head_identical':head_match,
            'tail_identical':tail_match,'other_fields_changed':fdiff,
            'nodes_before':n,'nodes_after':len(post_content),'nodes_added':len(added),
            'http':code}

if __name__=='__main__':
    os.makedirs('../post',exist_ok=True)
    keys=sys.argv[1:] or sorted(BLOCKS)
    for k in keys:
        if already(k): print(k,'already done'); continue
        r=one(k)
        open(LOG,'a').write(json.dumps(r)+'\n')
        print(k, r['result'], r.get('other_fields_changed',''), r.get('body',''))
        if r['result'] not in ('OK','SKIP-HAS-BLOCK'):
            print('*** STOPPING (Rule 50) ***'); sys.exit(1)
