import json,subprocess,shlex
BASE="https://api.staging.shopview.com/api"
COOKIE=open('cookies.txt').read().strip()
def call(method,path,body=None,raw=False):
    cmd=["curl","-s","-b","jar.txt","-c","jar.txt","-H",f"Cookie: {COOKIE}",
         "-H","Content-Type: application/json","-X",method,
         "-w","\n<<<%{http_code}>>>",BASE+path,"--max-time","60"]
    if body is not None: cmd+=["-d",json.dumps(body)]
    out=subprocess.run(cmd,capture_output=True,text=True).stdout
    txt,code=out.rsplit("\n<<<",1); code=int(code.rstrip(">>>\n").rstrip(">"))
    if raw: return code,txt
    try: return code,json.loads(txt)
    except Exception: return code,txt
def login(key="admin"):
    return call("POST","/quick-login",{"key":key})[0]
