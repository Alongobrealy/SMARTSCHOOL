import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
        
    # Fix the weird `hover:text-slate-800[#65676B]`
    # It seems `text-[#65676B]` was replaced by `text-slate-500`
    # and maybe it was `hover:text-[#050505] bg-[#65676B]`?
    # Let's just replace `hover:text-slate-800[#65676B]` with `hover:text-slate-800 hover:bg-slate-100`? No, let's just make it `hover:text-slate-800`
    new_content = content
    new_content = re.sub(r'hover:text-slate-800\[\#65676B\]', 'hover:text-slate-800', new_content)
    new_content = re.sub(r'hover:text-slate-900\[\#65676B\]', 'hover:text-slate-900', new_content)
    
    # Also look for any remaining #65676B and just remove them or fix them
    new_content = new_content.replace('[#65676B]', '')
    
    # Let's clean up any other missed colors
    new_content = new_content.replace('bg-[#1877F2]', 'bg-blue-600')
    new_content = new_content.replace('text-[#1877F2]', 'text-blue-600')
    new_content = new_content.replace('text-[#65676B]', 'text-slate-500')
    new_content = new_content.replace('text-[#050505]', 'text-slate-800')
    new_content = new_content.replace('border-[#E4E6EB]', 'border-slate-200')
    new_content = new_content.replace('bg-[#F0F2F5]', 'bg-slate-50')
    new_content = new_content.replace('bg-[#E7F3FF]', 'bg-blue-50')

    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

