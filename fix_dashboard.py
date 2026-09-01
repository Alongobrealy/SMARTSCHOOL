import re

with open('src/components/DashboardLayout.tsx', 'r') as f:
    content = f.read()

# Make the outer shell transparent
content = re.sub(
    r'<div className="h-screen w-full bg-\[\#F3F4F6\] text-\[\#1E293B\] flex font-sans overflow-hidden">',
    r'<div className="h-screen w-full bg-transparent text-[#1E293B] flex font-sans overflow-hidden">',
    content
)

# Sidebar styling
content = re.sub(
    r'<aside className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-slate-950 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out',
    r'<aside className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-slate-900/95 backdrop-blur-2xl text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl',
    content
)

# Sidebar active items (make them more glowing/glassy if needed, but current slate is okay. Let's make active blue)
content = re.sub(
    r"isActive \? 'bg-blue-600 text-white' : 'hover:bg-slate-900 hover:text-white'",
    r"isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'hover:bg-slate-800/50 hover:text-white'",
    content
)

# Header styling
content = re.sub(
    r'<header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 shrink-0 shadow-sm">',
    r'<header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 shrink-0 shadow-sm transition-all">',
    content
)

# Welcome section (H1)
content = re.sub(
    r'<h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">',
    r'<h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">',
    content
)

# "Dummy" dashboard cards in DashboardLayout (if rendered)
content = re.sub(
    r'className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col',
    r'className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-slate-200/60 flex flex-col hover:-translate-y-1',
    content
)

# Also fix the inner content area (it's fine to leave it transparent so grid shows)
# Let's write back
with open('src/components/DashboardLayout.tsx', 'w') as f:
    f.write(content)
