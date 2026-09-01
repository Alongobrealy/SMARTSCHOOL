import re

with open('src/components/modals/DeveloperAuthModal.tsx', 'r') as f:
    content = f.read()

# Fix outer wrapper
content = re.sub(
    r'className="bg-white text-slate-500 w-full max-w-md rounded-lg border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-6"',
    r'className="bg-white w-full max-w-md rounded-2xl border border-slate-200/60 shadow-2xl overflow-hidden flex flex-col my-6"',
    content
)

# Fix header
content = re.sub(
    r'className="bg-blue-600 px-6 py-5 flex items-center justify-between border-b border-slate-200"',
    r'className="bg-slate-900 px-6 py-5 flex items-center justify-between border-b border-slate-800"',
    content
)

# Fix Inputs
content = re.sub(
    r'className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2\.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 font-mono tracking-widest"',
    r'className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-mono tracking-widest transition-all"',
    content
)
content = re.sub(
    r'className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2\.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 font-mono"',
    r'className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-mono transition-all"',
    content
)

# Fix buttons
content = re.sub(
    r'className="flex-1 px-4 py-2\.5 bg-slate-50 hover:bg-slate-50 text-slate-500 rounded-xl text-sm font-bold transition-colors cursor-pointer border border-slate-200"',
    r'className="flex-1 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold transition-colors cursor-pointer border border-slate-200/60"',
    content
)
content = re.sub(
    r'className="flex-1 px-4 py-2\.5 bg-blue-600 hover:bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"',
    r'className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"',
    content
)

with open('src/components/modals/DeveloperAuthModal.tsx', 'w') as f:
    f.write(content)

