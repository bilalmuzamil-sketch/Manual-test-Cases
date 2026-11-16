"""Print library cases in full (tester text + the source each bullet rests on). python3 po-answers-2026-11-16/v38/show.py KEY ... [--src]"""
import sys, os
sys.path.insert(0, 'authoring'); os.chdir('authoring')
import build  # noqa  (runs the build; output suppressed by caller)
