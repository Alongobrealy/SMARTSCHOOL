import re
with open('src/components/modules/DeveloperSuperAdminModule.tsx', 'r') as f:
    content = f.read()

# Make sure buttons look right
content = re.sub(r'rounded-2xl text-white', 'rounded-xl text-white', content)
content = re.sub(r'rounded-2xl flex items-center justify-center font-black', 'rounded-2xl flex items-center justify-center font-bold', content)

# Header banner was set to bg-slate-900 which is very cool for developer terminal
# But let's make sure it doesn't conflict with any blue backgrounds inside it
content = re.sub(
    r'className="px-3\.5 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-rose-200 rounded-xl text-xs font-bold flex items-center gap-1\.5 transition-all cursor-pointer shadow-xs"',
    r'className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer"',
    content
)

# Text tracking
content = re.sub(r'uppercase tracking-widest', 'uppercase tracking-wider', content)
content = re.sub(r'text-sm\.5', 'text-sm', content)
content = re.sub(r'shadow-xs', 'shadow-sm', content)

with open('src/components/modules/DeveloperSuperAdminModule.tsx', 'w') as f:
    f.write(content)

