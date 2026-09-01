import re

with open('src/components/CommercialFlyer.tsx', 'r') as f:
    content = f.read()

# Make the outer container transparent (since App.tsx has the background)
content = re.sub(
    r'<div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white">',
    r'<div className="min-h-screen text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white">',
    content
)

# Fix Header (glassmorphism)
content = re.sub(
    r'className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 text-xs font-medium shadow-sm"',
    r'className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 sm:px-6 lg:px-8 py-4 text-xs font-medium shadow-sm transition-all"',
    content
)
content = re.sub(
    r'font-extrabold tracking-tight text-base sm:text-lg',
    r'font-display font-black tracking-tight text-lg sm:text-xl',
    content
)

# Fix Hero Section
content = re.sub(
    r'<section className="relative bg-white pt-16 sm:pt-24 pb-12 sm:pb-20 overflow-hidden border-b border-slate-200">',
    r'<section className="relative pt-20 sm:pt-28 pb-16 sm:pb-24 overflow-hidden border-b border-slate-200/50">',
    content
)
# Center the text, apply font-display to H1 and P
content = re.sub(
    r'className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-\[1\.1\]"',
    r'className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] text-center mx-auto max-w-4xl"',
    content
)
content = re.sub(
    r'className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl"',
    r'className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto text-center"',
    content
)

# Flex containers in hero that were left-aligned need to be centered
content = re.sub(
    r'<div className="flex flex-wrap items-center gap-4 pt-4">',
    r'<div className="flex flex-wrap items-center justify-center gap-4 pt-6">',
    content
)
content = re.sub(
    r'<div className="flex items-center gap-6 text-sm font-bold text-slate-700">',
    r'<div className="flex items-center justify-center gap-6 text-sm font-bold text-slate-700 mt-8">',
    content
)
content = re.sub(
    r'<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">',
    r'<div className="flex flex-col items-center max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8 text-center">',
    content
)
# In CommercialFlyer there was a two-column layout for the hero. If I replace it with flex-col, it will center everything. 
# Let's be careful not to break the layout completely if there is an image on the right.
with open('src/components/CommercialFlyer.tsx', 'w') as f:
    f.write(content)

