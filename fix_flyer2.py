import re

with open('src/components/CommercialFlyer.tsx', 'r') as f:
    content = f.read()

# Make Hero rounded-3xl and glassy
content = re.sub(
    r'<div className="relative rounded-lg bg-white border border-slate-200 p-6 sm:p-10 lg:p-12 shadow-sm text-center py-16 sm:py-20">',
    r'<div className="relative rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/60 p-6 sm:p-10 lg:p-12 shadow-2xl text-center py-16 sm:py-20 transition-all hover:shadow-blue-600/10 hover:border-blue-200">',
    content
)

# Hero H1
content = re.sub(
    r'<h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-\[1\.15\]">',
    r'<h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">',
    content
)
content = re.sub(
    r'<p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">',
    r'<p className="text-sm sm:text-lg text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed mt-2">',
    content
)

# Primary Buttons (vitrine)
content = re.sub(
    r'className="w-full sm:w-auto bg-blue-600 hover:bg-\[\#166FE5\] text-white font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors text-sm"',
    r'className="w-full sm:w-auto bg-blue-600 hover:bg-[#166FE5] text-white font-display font-bold px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all active:scale-95 text-sm"',
    content
)
content = re.sub(
    r'className="w-full sm:w-auto bg-slate-50 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 border border-slate-200 transition-colors text-sm"',
    r'className="w-full sm:w-auto bg-slate-50/80 hover:bg-white text-slate-800 font-display font-bold px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 border border-slate-200/60 transition-all shadow-sm active:scale-95 text-sm"',
    content
)

# Header Login button
content = re.sub(
    r'className="flex items-center justify-center gap-1\.5 text-white bg-blue-600 hover:bg-\[\#166FE5\] px-4 py-1\.5 rounded-lg transition-colors font-bold text-xs shadow-sm"',
    r'className="flex items-center justify-center gap-1.5 text-white bg-blue-600 hover:bg-[#166FE5] px-4 py-2 rounded-lg transition-all font-display font-bold text-xs shadow-sm shadow-blue-600/20 active:scale-95"',
    content
)

# Features grid
content = re.sub(
    r'<h2 className="text-2xl font-black text-slate-800">',
    r'<h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">',
    content
)

# Feature cards
content = re.sub(
    r'className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm flex flex-col gap-3 group"',
    r'className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 shadow-lg flex flex-col gap-3 group transition-all hover:-translate-y-1 hover:shadow-xl hover:border-blue-200 hover:bg-white"',
    content
)

# Footer grid and Pricing cards
content = re.sub(
    r'className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col',
    r'className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden flex flex-col transition-all hover:-translate-y-1',
    content
)
content = re.sub(
    r'className="bg-blue-600 rounded-lg border border-blue-500 shadow-md overflow-hidden flex flex-col relative',
    r'className="bg-blue-600 rounded-3xl border border-blue-500 shadow-2xl shadow-blue-600/30 overflow-hidden flex flex-col relative transition-all hover:-translate-y-1 scale-[1.02]',
    content
)
content = re.sub(
    r'<h3 className="text-2xl font-black">',
    r'<h3 className="font-display text-2xl font-extrabold">',
    content
)
content = re.sub(
    r'<div className="text-3xl font-black mt-2">',
    r'<div className="font-display text-4xl font-extrabold mt-2 tracking-tight">',
    content
)

with open('src/components/CommercialFlyer.tsx', 'w') as f:
    f.write(content)
