import os
import re

def flex_replace(content):
    # Some replacements were already done, but some might have been missed due to whitespace.
    # Let's fix table headers universally
    content = re.sub(
        r'px-4\s+py-3\s+text-left\s+text-xs\s+font-bold\s+text-slate-500\s+uppercase\s+tracking-widest',
        r'px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider',
        content
    )
    content = re.sub(
        r'px-4\s+py-3\s+text-sm\.5',
        r'px-6 py-4 text-sm',
        content
    )
    content = re.sub(
        r'px-4\s+py-3\s+text-right\s+text-xs\s+font-bold\s+text-slate-500\s+uppercase\s+tracking-widest',
        r'px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider',
        content
    )
    content = re.sub(
        r'w-11\s+h-11\s+rounded-lg\s+bg-blue-50\s+text-blue-600\s+flex\s+items-center\s+justify-center\s+font-bold\s+shrink-0',
        r'w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm border border-blue-100',
        content
    )
    # Buttons
    content = re.sub(
        r'w-full\s+md:w-auto\s+px-4\s+py-2\.5\s+bg-blue-600\s+hover:bg-blue-600\s+text-white\s+rounded-xl\s+text-xs\s+font-bold\s+flex\s+items-center\s+justify-center\s+gap-2\s+shadow-sm\s+transition-all\s+cursor-pointer\s+shrink-0',
        r'w-full md:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 transition-all cursor-pointer shrink-0',
        content
    )
    return content

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = flex_replace(content)
    
    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Upgraded flex styles in {filepath}")

for root, _, files in os.walk('src/components/modules'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
