import sys; sys.path.insert(0,'/home/user/Manual-test-Cases/build/testing-tools')
from ticket_exhibit import panel, stack, RED, GRN
a=panel('ev/prod-scroll-ZZ12410-bottom.png',crop=(300,360,1200,800),
 title='1. PRODUCTION (build v26.45.2-132dcb4), work order S2-1943, Add Part, typed ZZ12410, scrolled to the end',
 boxes=[(426,656,945,752,RED,1)],
 notes=[(1,RED,'The list ends at ZZ12410 Seal Ring 200. 210 parts at this location contain ZZ12410; Seal Ring 201 to 210 never appear.')])
b=panel('ev/prod-find-zz210.png',crop=(300,360,1200,700),
 title='2. PRODUCTION, typed ZZ12410-210',
 boxes=[(431,426,941,532,GRN,1)],
 notes=[(1,GRN,'With the full number typed, ZZ12410 Seal Ring 210 appears. The part exists; the one-word search just never reaches it.')])
stack([a,b]).save('ev/jira/04-production-zz12410.png'); print('ok')
