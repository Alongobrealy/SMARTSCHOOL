import re

with open('src/components/modules/DeveloperSuperAdminModule.tsx', 'r') as f:
    content = f.read()

# Make the outer container relative and inject the background grid
if 'bg-[radial-gradient' not in content:
    content = re.sub(
        r'<div className="space-y-6">',
        r'''<div className="space-y-6 relative z-0">
      {/* Background Ambience Grid & Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#6366f1_1.2px,transparent_1.2px)] [background-size:28px_28px] -z-10"></div>
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none -z-10"></div>
''',
        content
    )

# Fix Header banner to use backdrop-blur and font-display
content = re.sub(
    r'className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden"',
    r'className="bg-slate-900/95 backdrop-blur-xl text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden group"',
    content
)

# Fix title font in banner
content = re.sub(
    r'className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1"',
    r'className="font-display text-xl sm:text-3xl font-extrabold text-white tracking-tight mt-1"',
    content
)

# Tab buttons: adjust style
content = re.sub(
    r'className={`px-4 py-2\.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shrink-0 cursor-pointer \$\{',
    r'className={`px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${',
    content
)

content = re.sub(
    r"bg-white text-slate-500 hover:bg-slate-50 border border-slate-200/60 shadow-sm",
    r"bg-white/80 backdrop-blur-md text-slate-600 hover:bg-white hover:text-slate-900 border border-slate-200/60 shadow-sm",
    content
)

# Metric cards: glassy effect + font display
content = re.sub(
    r'className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-5"',
    r'className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/60 shadow-xl flex items-center gap-5 transition-transform hover:-translate-y-1"',
    content
)

content = re.sub(
    r'className="text-2xl font-black text-slate-800 "',
    r'className="font-display text-3xl font-extrabold text-slate-800 tracking-tight"',
    content
)

# Table containers: rounded-3xl and backdrop-blur
content = re.sub(
    r'className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden"',
    r'className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden"',
    content
)

# Section Headers inside tabs
content = re.sub(
    r'className="text-lg sm:text-xl font-bold text-slate-800"',
    r'className="font-display text-lg sm:text-2xl font-extrabold text-slate-800 tracking-tight"',
    content
)
content = re.sub(
    r'className="text-base font-bold text-slate-800"',
    r'className="font-display text-lg font-bold text-slate-800"',
    content
)

# General inputs
content = re.sub(
    r'className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2\.5 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"',
    r'className="w-full bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-sm"',
    content
)

with open('src/components/modules/DeveloperSuperAdminModule.tsx', 'w') as f:
    f.write(content)
