import re,sys
t=open(sys.argv[1]).read()
ids=set(sys.argv[2:])
for b in re.split(r"\n(?=##C)",t):
    m=re.match(r"##C(\d+)",b)
    if m and m.group(1) in ids: print(b,"\n")
