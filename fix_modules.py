import os
import glob
import re

modules = glob.glob('src/components/modules/*.tsx') + glob.glob('src/components/modals/*.tsx')

for filepath in modules:
    with open(filepath, 'r') as f:
        content = f.read()
        
    # Cards / Sections
    content = re.sub(
        r'bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm',
        r'bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-xl transition-all',
        content
    )
    content = re.sub(
        r'bg-white p-6 rounded-2xl border border-slate-200 shadow-sm',
        r'bg-white/95 backdrop-blur-2xl p-6 rounded-3xl border border-slate-200/60 shadow-xl transition-all',
        content
    )
    content = re.sub(
        r'bg-white rounded-xl p-5 border border-slate-200 shadow-sm',
        r'bg-white/95 backdrop-blur-2xl rounded-3xl p-5 border border-slate-200/60 shadow-lg hover:-translate-y-1 transition-all',
        content
    )
    content = re.sub(
        r'bg-white rounded-2xl border border-slate-200 shadow-sm',
        r'bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden',
        content
    )
    # Headings
    content = re.sub(
        r'className="text-xl sm:text-2xl font-bold text-slate-800"',
        r'className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"',
        content
    )
    content = re.sub(
        r'className="text-lg font-bold text-slate-800"',
        r'className="font-display text-xl font-bold text-slate-800 tracking-tight"',
        content
    )
    content = re.sub(
        r'className="text-2xl font-black text-slate-800"',
        r'className="font-display text-3xl font-extrabold text-slate-900 tracking-tight"',
        content
    )
    
    # Tables outer containers
    content = re.sub(
        r'bg-white rounded-xl border border-slate-200 overflow-hidden',
        r'bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/60 overflow-hidden shadow-xl',
        content
    )
    
    # Update buttons
    content = re.sub(
        r'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm',
        r'bg-blue-600 hover:bg-[#166FE5] text-white px-5 py-2.5 rounded-xl font-display text-sm font-bold shadow-md shadow-blue-600/20 active:scale-95 transition-all',
        content
    )
    
    # Search bars / inputs
    content = re.sub(
        r'bg-slate-50 border-slate-200 text-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600',
        r'bg-white/80 backdrop-blur-sm border-slate-200/80 text-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600/30 transition-all shadow-sm',
        content
    )

    with open(filepath, 'w') as f:
        f.write(content)

print("Done processing modules.")
