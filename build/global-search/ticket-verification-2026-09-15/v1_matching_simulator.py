# Reproduce V1's matching exactly: build the search text the way the SQL did, then apply the
# client's two passes. No guessing - this is the algorithm, run.
def blob(parts):                      # REPLACE(LOWER(CONCAT(...)), " ", "")
    return "".join(parts).lower().replace(" ", "")
def phone(p):                         # REPLACE(REPLACE(tel, ")", "-"), "(", "")
    return p.replace(")", "-").replace("(", "")
def q(s):                             # search.toLowerCase() then .replace(/\s+/g,'')
    return " ".join(s.lower().split()).replace(" ", "")

vehicle = blob(["ZZAUTOTEST Bridgeport Hauling", "2019", "Freightliner", "Cascadia",
                "ZZT-4471", "1FUJGLDR9KLZZ4471", "OHZZT471"])
customer = blob(["ZZAUTOTEST Bridgeport Hauling", "ZZAUTOTESTBridgeportHauling",
                 "1450 Kestrelway Industrial", "Dock 7B", "Ohio", "44872-9931", "Fernvale",
                 phone("(419) 555-0143"), "bridgeporthauling-zzt.com",
                 "Marlene", "Okonkwo", "Dispatch Supervisor", phone("(419) 555-0177")])
print("VEHICLE searchable text :", vehicle)
print("CUSTOMER searchable text:", customer, "\n")
def check(label, hay, queries):
    print(f"--- {label} ---")
    for s in queries:
        print(f"   {'MATCHES' if q(s) in hay else 'no match':<9}  typing {s!r}   (becomes {q(s)!r})")
check("SV-10055  vehicle by year + make/model", vehicle,
      ["2019 Freightliner", "2019 Cascadia", "Cascadia 2019", "Freightliner Cascadia", "2019", "Freightliner"])
check("SV-10057  customer by its own phone", customer,
      ["(419) 555-0143", "419-555-0143", "4195550143", "419 555 0143", "555-0143"])
check("SV-10058  vehicle by part of the chassis number", vehicle,
      ["1FUJGLDR9KLZZ4471", "ZZ4471", "LDR9KL"])
check("SV-10060  fragment from the middle of a field", customer,
      ["idgepor (middle of the name)".split()[0], "ernva (middle of the town)".split()[0],
       "estrelw (middle of the street)".split()[0], "4872-99 (middle of the postcode)".split()[0]])
