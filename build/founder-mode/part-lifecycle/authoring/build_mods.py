"""Import every case module once (used by ledger.py, render_setup.py, render_outputs.py). WRITTEN: the sections marked written."""
import importlib, os
import pllib as L
MODS = ["cases_s1", "cases_s2", "cases_s3", "cases_s4", "cases_s5", "cases_s6", "cases_s7", "cases_s8", "cases_s9", "cases_s10",
        "cases_s11", "cases_s12", "cases_s13", "cases_iv", "cases_design"]
WRITTEN = set()
for m in MODS:
    if os.path.exists(f"{L.D}/{m}.py"):
        mod = importlib.import_module(m)
        if getattr(mod, "WRITTEN", False): WRITTEN.add(getattr(mod, "SECTION", m.replace("cases_", "").upper()))
