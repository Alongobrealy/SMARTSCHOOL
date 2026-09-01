import os
import glob
import re

files = glob.glob('src/components/modules/*.tsx') + glob.glob('src/components/modals/*.tsx') + ['src/components/DashboardLayout.tsx', 'src/App.tsx']

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Backgrounds
    content = content.replace('bg-white/95', 'bg-white/95 dark:bg-slate-900/95')
    content = content.replace('bg-white/90', 'bg-white/90 dark:bg-slate-900/90')
    content = content.replace('bg-white/80', 'bg-white/80 dark:bg-slate-900/80')
    content = content.replace('bg-white ', 'bg-white dark:bg-slate-900 ')
    content = content.replace('bg-slate-50', 'bg-slate-50 dark:bg-slate-800/50')
    content = content.replace('bg-slate-100', 'bg-slate-100 dark:bg-slate-800')

    # 2. Text colors
    content = content.replace('text-slate-900', 'text-slate-900 dark:text-white')
    content = content.replace('text-slate-800', 'text-slate-800 dark:text-slate-100')
    content = content.replace('text-slate-700', 'text-slate-700 dark:text-slate-200')
    content = content.replace('text-slate-600', 'text-slate-600 dark:text-slate-300')
    content = content.replace('text-slate-500', 'text-slate-500 dark:text-slate-400')
    content = content.replace('text-[#1E293B]', 'text-[#1E293B] dark:text-slate-100')
    content = content.replace('text-gray-800', 'text-gray-800 dark:text-gray-100')
    
    # 3. Borders
    content = content.replace('border-slate-200/60', 'border-slate-200/60 dark:border-slate-700/60')
    content = content.replace('border-slate-200/80', 'border-slate-200/80 dark:border-slate-700/80')
    content = content.replace('border-slate-200', 'border-slate-200 dark:border-slate-700')
    content = content.replace('border-slate-100', 'border-slate-100 dark:border-slate-700/50')
    content = content.replace('border-gray-200', 'border-gray-200 dark:border-slate-700')

    # Revert duplicates if they occur by simple replace
    content = content.replace('dark:bg-slate-900/95 dark:dark:bg-slate-900/95', 'dark:bg-slate-900/95')
    content = content.replace('dark:text-white dark:dark:text-white', 'dark:text-white')
    content = content.replace('dark:border-slate-700/60 dark:dark:border-slate-700/60', 'dark:border-slate-700/60')

    with open(filepath, 'w') as f:
        f.write(content)

print("Dark mode classes added.")
