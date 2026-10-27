"""Import every case module once (used by ledger.py, render_setup.py, render_outputs.py, build.py). WRITTEN: the sections marked written."""
import importlib, os
import wwlib as L
MODS = ["cases_s1", "cases_s2", "cases_s3", "cases_s4", "cases_design"]
WRITTEN = set()
for m in MODS:
    if os.path.exists(f"{L.D}/{m}.py"):
        mod = importlib.import_module(m)
        if getattr(mod, "WRITTEN", False): WRITTEN.add(getattr(mod, "SECTION", m.replace("cases_", "").upper()))
