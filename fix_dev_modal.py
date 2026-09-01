import re

with open('src/components/modals/DeveloperAuthModal.tsx', 'r') as f:
    content = f.read()

# Fix icon background and text color
content = re.sub(
    r'className="w-10 h-10 rounded-lg bg-blue-600 border border-slate-200 flex items-center justify-center font-bold text-blue-600 shadow-inner"',
    r'className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg"',
    content
)
content = re.sub(
    r'<Terminal className="w-5 h-5 text-blue-600" />',
    r'<Terminal className="w-5 h-5 text-white" />',
    content
)

# Replace fonts in modal header
content = re.sub(
    r'<h3 className="text-base font-extrabold text-white">',
    r'<h3 className="font-display text-lg font-extrabold text-white tracking-tight">',
    content
)

# Fix outer wrapper and add grid background
content = re.sub(
    r'className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"',
    r'className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"',
    content
)

content = re.sub(
    r'<div className="bg-white w-full max-w-md rounded-2xl border border-slate-200/60 shadow-2xl overflow-hidden flex flex-col my-6">',
    r'<div className="relative bg-white/95 backdrop-blur-2xl w-full max-w-md rounded-3xl border border-slate-200/60 shadow-2xl overflow-hidden flex flex-col my-6">',
    content
)

# Let's fix the info box
content = re.sub(
    r'className="bg-indigo-950/40 border border-slate-200 rounded-lg p-4 flex items-start gap-3"',
    r'className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3"',
    content
)
content = re.sub(
    r'className="p-1\.5 rounded-xl text-slate-500 hover:text-white hover:bg-white transition-colors cursor-pointer"',
    r'className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"',
    content
)

with open('src/components/modals/DeveloperAuthModal.tsx', 'w') as f:
    f.write(content)
