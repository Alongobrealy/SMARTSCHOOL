import os
import re

replacements = {
    r'text-\[\#050505\]': 'text-slate-800',
    r'text-\[\#65676B\]': 'text-slate-500',
    r'text-\[\#1877F2\]': 'text-blue-600',
    
    r'bg-\[\#1877F2\]': 'bg-blue-600',
    r'bg-\[\#F0F2F5\]': 'bg-slate-50',
    r'bg-\[\#E7F3FF\]': 'bg-blue-50',
    r'bg-\[\#F8F9FA\]': 'bg-slate-50',
    
    r'border-\[\#E4E6EB\]': 'border-slate-200',
    r'border-\[\#1877F2\]': 'border-blue-600',
    
    r'hover:bg-\[\#1877F2\]': 'hover:bg-blue-700',
    r'hover:bg-\[\#F0F2F5\]': 'hover:bg-slate-100',
    r'hover:text-\[\#1877F2\]': 'hover:text-blue-600',
    r'hover:text-\[\#050505\]': 'hover:text-slate-900',
    
    r'fill-\[\#1877F2\]': 'fill-blue-600',
    r'stroke-\[\#1877F2\]': 'stroke-blue-600',
    
    r'\[\#1877F2\]': '#2563eb', # Just in case it's used in inline styles or non-Tailwind
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
        
    new_content = content
    for pattern, replacement in replacements.items():
        new_content = re.sub(pattern, replacement, new_content)
        
    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

