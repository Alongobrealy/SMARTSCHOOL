import re

with open('src/components/CommercialFlyer.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r'className="flex items-center justify-center gap-1\.5 text-slate-800 bg-slate-50 hover:bg-slate-200 px-4 py-1\.5 rounded-lg transition-colors font-bold text-xs"',
    r'className="flex items-center justify-center gap-1.5 text-slate-800 bg-slate-50/80 hover:bg-white px-4 py-2 rounded-lg transition-all font-display font-bold text-xs border border-slate-200/60 shadow-sm active:scale-95"',
    content
)

content = re.sub(
    r'className={`w-full py-2\.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer \$\{([^}]+)\}`}',
    r'className={`w-full py-3 px-4 rounded-xl text-sm font-display font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${ \1.replace("rounded-lg", "rounded-xl").replace("shadow-sm", "shadow-md shadow-blue-600/30") }`}',
    content
)

content = re.sub(
    r'className="w-full sm:w-auto bg-slate-50 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2\.5 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-1\.5 transition-colors border border-slate-200"',
    r'className="w-full sm:w-auto bg-slate-50 hover:bg-white text-slate-800 font-display font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all border border-slate-200/60 shadow-sm active:scale-95"',
    content
)

content = re.sub(
    r'className="w-full sm:w-auto bg-\[\#25D366\] hover:bg-\[\#20bd5a\] text-white font-extrabold px-5 py-2\.5 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"',
    r'className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white font-display font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#25D366]/30 active:scale-95"',
    content
)

with open('src/components/CommercialFlyer.tsx', 'w') as f:
    f.write(content)
