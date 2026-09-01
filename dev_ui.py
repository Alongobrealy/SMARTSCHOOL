import re

with open('src/components/modules/DeveloperSuperAdminModule.tsx', 'r') as f:
    content = f.read()

# Fix Header Banner
content = re.sub(
    r'className="bg-blue-600 text-white rounded-lg p-6 sm:p-7 border border-slate-200/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"',
    r'className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden"',
    content
)

# Fix Icon in Header Banner
content = re.sub(
    r'className="w-14 h-14 rounded-lg bg-blue-600 border-2 border-slate-200/60 flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-sm"',
    r'className="w-14 h-14 rounded-2xl bg-blue-600 border border-blue-500/30 flex items-center justify-center text-white shadow-lg shadow-blue-900/20"',
    content
)

# Fix Terminal Icon inside it
content = re.sub(
    r'<Terminal className="w-7 h-7 text-blue-600" />',
    r'<Terminal className="w-7 h-7 text-white" />',
    content
)

# Fix sub-badge inside header
content = re.sub(
    r'className="bg-blue-600 text-blue-600 border border-slate-200/60 text-\[10px\] font-mono font-bold px-2\.5 py-0\.5 rounded-lg flex items-center gap-1\.5 animate-pulse"',
    r'className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 animate-pulse"',
    content
)

# Radio icon in badge
content = re.sub(
    r'<Radio className="w-3 h-3 text-blue-600" />',
    r'<Radio className="w-3 h-3 text-blue-400" />',
    content
)

# Text inside header
content = re.sub(
    r'className="text-slate-500 font-mono text-\[11px\]"',
    r'className="text-slate-400 font-mono text-[11px]"',
    content
)
content = re.sub(
    r'Latence : <strong className="text-blue-600">',
    r'Latence : <strong className="text-blue-400">',
    content
)
content = re.sub(
    r'className="text-xs text-blue-600/80 font-medium mt-0\.5"',
    r'className="text-xs text-slate-400 font-medium mt-1"',
    content
)

# Header Buttons
content = re.sub(
    r'className="px-3\.5 py-2 bg-blue-600 hover:bg-blue-700 border border-slate-200/60 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-600/20 flex items-center gap-1\.5 transition-all cursor-pointer shadow-xs"',
    r'className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 border-none text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-900/20 flex items-center gap-1.5 transition-all cursor-pointer"',
    content
)
content = re.sub(
    r'<Download className="w-3\.5 h-3\.5 text-blue-600" />',
    r'<Download className="w-4 h-4 text-white" />',
    content
)

# Tabs
content = re.sub(
    r'className={`px-4 py-2\.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer \$\{',
    r'className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shrink-0 cursor-pointer ${',
    content
)
content = re.sub(
    r'bg-blue-600 text-white shadow-md shadow-sm scale-102',
    r'bg-slate-800 text-white shadow-md',
    content
)
content = re.sub(
    r'bg-white\s+text-slate-500\s+hover:bg-slate-50/80 border border-slate-200/60',
    r'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200/60 shadow-sm',
    content
)

# Icon inside active tab
content = re.sub(
    r"text-blue-600 '",
    r"text-slate-400 '",
    content
)

# Cards rounded-lg -> rounded-2xl
content = re.sub(r'rounded-lg', r'rounded-2xl', content)
content = re.sub(r'rounded-2xl bg-white', r'bg-white rounded-2xl', content)
# Restore button rounded-2xl to rounded-xl if needed, but 2xl is fine for buttons too sometimes, let's keep xl for buttons where possible. We'll leave it as is if it changes.
content = re.sub(r'rounded-2xl text-xs font-bold', r'rounded-xl text-sm font-semibold', content)
content = re.sub(r'rounded-2xl text-sm font-medium', r'rounded-xl text-sm font-medium', content)

# General bg-white cards
content = re.sub(
    r'className="bg-white\s+p-5\s+rounded-2xl\s+border\s+border-slate-200/60\s+shadow-xs\s+flex\s+items-center\s+gap-4"',
    r'className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-5"',
    content
)

# Table tweaks
content = re.sub(
    r'className="bg-white\s+rounded-2xl\s+shadow-xs\s+border\s+border-slate-200/60\s+overflow-hidden"',
    r'className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden"',
    content
)
content = re.sub(
    r'className="bg-slate-50\s+border-y\s+border-slate-200/60\s*"',
    r'className="bg-slate-50/50 border-y border-slate-200/60"',
    content
)

# Action buttons inside tables
content = re.sub(
    r'className="p-1\.5 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-colors cursor-pointer"',
    r'className="p-2 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors cursor-pointer"',
    content
)
content = re.sub(
    r'className="p-1\.5 bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-colors cursor-pointer"',
    r'className="p-2 bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors cursor-pointer"',
    content
)

with open('src/components/modules/DeveloperSuperAdminModule.tsx', 'w') as f:
    f.write(content)
print("Updated Developer UI")
