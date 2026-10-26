import sys
p = "/home/user/Manual-test-Cases/build/credit-terms/authoring/scenarios.py"
t = open(p).read().rstrip()
assert t.endswith("}")
add = open(sys.argv[1]).read().rstrip("\n") + "\n"
open(p, "w").write(t[:-1] + add + "}\n")
