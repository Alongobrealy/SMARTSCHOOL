import os
import re

def upgrade_styles(content):
    # Header card
    content = re.sub(
        r'className="bg-white\s+rounded-lg\s+p-4\s+sm:p-6\s+border\s+border-slate-200\s+shadow-sm\s+flex\s+flex-col\s+md:flex-row\s+items-center\s+justify-between\s+gap-4\s+text-center\s+md:text-left"',
        r'className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden group"',
        content
    )
    
    # Filter bar card
    content = re.sub(
        r'className="bg-white\s+rounded-lg\s+p-4\s+border\s+border-slate-200\s+shadow-sm\s+flex\s+flex-col\s+sm:flex-row\s+items-center\s+justify-between\s+gap-3"',
        r'className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"',
        content
    )
    
    # Table wrappers
    content = re.sub(
        r'className="bg-white\s+rounded-lg\s+shadow-sm\s+border\s+border-slate-200\s+overflow-hidden"',
        r'className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden"',
        content
    )
    
    # Search Inputs
    content = re.sub(
        r'className="w-full\s+bg-slate-50\s+border\s+border-slate-200\s+rounded-xl\s+pl-9\s+pr-3\s+py-2\s+text-xs\s+font-semibold\s+text-slate-800\s+focus:ring-2\s+focus:ring-indigo-500"',
        r'className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"',
        content
    )
    
    # Selects
    content = re.sub(
        r'className="bg-slate-50\s+border\s+border-slate-200\s+rounded-xl\s+px-3\s+py-2\s+text-xs\s+font-semibold\s+text-slate-800\s*"',
        r'className="bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"',
        content
    )
    
    # Primary Buttons
    content = re.sub(
        r'className="w-full\s+md:w-auto\s+px-4\s+py-2\.5\s+bg-blue-600\s+hover:bg-blue-600\s+text-white\s+rounded-xl\s+text-xs\s+font-bold\s+flex\s+items-center\s+justify-center\s+gap-2\s+shadow-sm\s+transition-all\s+cursor-pointer\s+shrink-0"',
        r'className="w-full md:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 transition-all cursor-pointer shrink-0"',
        content
    )

    content = re.sub(
        r'className="w-full\s+md:w-auto\s+px-4\s+py-2\.5\s+bg-blue-600\s+hover:bg-blue-700\s+text-white\s+rounded-xl\s+text-xs\s+font-bold\s+flex\s+items-center\s+justify-center\s+gap-2\s+shadow-sm\s+transition-all\s+cursor-pointer\s+shrink-0"',
        r'className="w-full md:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 transition-all cursor-pointer shrink-0"',
        content
    )
    
    # Header Icon wrapper
    content = re.sub(
        r'className="w-11\s+h-11\s+rounded-lg\s+bg-blue-50\s+text-blue-600\s+flex\s+items-center\s+justify-center\s+font-bold\s+shrink-0"',
        r'className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-blue-100"',
        content
    )
    
    # Header title
    content = re.sub(
        r'className="text-base\s+sm:text-lg\s+font-black\s+text-slate-800\s*"',
        r'className="text-lg sm:text-xl font-bold text-slate-800"',
        content
    )
    
    # General Table Header
    content = re.sub(
        r'className="bg-slate-50\s+border-y\s+border-slate-200\s*"',
        r'className="bg-slate-50/50 border-y border-slate-200/60"',
        content
    )
    
    # Table th
    content = re.sub(
        r'className="px-4\s+py-3\s+text-left\s+text-xs\s+font-bold\s+text-slate-500\s+uppercase\s+tracking-widest"',
        r'className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"',
        content
    )
    content = re.sub(
        r'className="px-4\s+py-3\s+text-left\s+text-xs\s+font-bold\s+text-slate-500\s+uppercase\s+tracking-widest\s+text-center"',
        r'className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider"',
        content
    )
    content = re.sub(
        r'className="px-4\s+py-3\s+text-left\s+text-xs\s+font-bold\s+text-slate-500\s+uppercase\s+tracking-widest\s+text-right"',
        r'className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider"',
        content
    )
    
    # Table td
    content = re.sub(
        r'className="px-4\s+py-3\s+text-sm\.5"',
        r'className="px-6 py-4 text-sm"',
        content
    )
    content = re.sub(
        r'className="px-4\s+py-3\s+text-sm\.5\s+text-center"',
        r'className="px-6 py-4 text-sm text-center"',
        content
    )
    content = re.sub(
        r'className="px-4\s+py-3\s+text-sm\.5\s+text-right"',
        r'className="px-6 py-4 text-sm text-right"',
        content
    )
    
    # Action buttons in tables (Edit/Delete)
    content = re.sub(
        r'className="p-1\.5\s+bg-blue-50\s+text-blue-600\s+hover:bg-blue-600\s+hover:text-white\s+rounded-lg\s+transition-colors"',
        r'className="p-2 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"',
        content
    )
    content = re.sub(
        r'className="p-1\.5\s+bg-red-50\s+text-red-600\s+hover:bg-red-600\s+hover:text-white\s+rounded-lg\s+transition-colors"',
        r'className="p-2 bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer"',
        content
    )
    
    # Table tr
    content = re.sub(
        r'className="hover:bg-slate-50"',
        r'className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-0"',
        content
    )

    return content

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = upgrade_styles(content)
    
    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Upgraded styles in {filepath}")

for root, _, files in os.walk('src/components/modules'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
