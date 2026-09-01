import re

with open('src/components/auth/LoginPortal.tsx', 'r') as f:
    content = f.read()

# Fix logo upload box to fit blue background
content = content.replace(
    'className="w-10 h-10 sm:w-11 sm:h-11 bg-slate-100 dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 shadow-sm"',
    'className="w-10 h-10 sm:w-11 sm:h-11 bg-white/10 rounded-lg border border-dashed border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors shrink-0 shadow-sm"'
)
content = content.replace(
    '<Upload className="w-4 h-4 text-slate-400 dark:text-slate-500" />',
    '<Upload className="w-4 h-4 text-white/70" />'
)

with open('src/components/auth/LoginPortal.tsx', 'w') as f:
    f.write(content)

