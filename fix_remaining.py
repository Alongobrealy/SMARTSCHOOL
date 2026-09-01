import os

replacements = {
    '[#E4E6EB]': 'slate-200',
    'text-[#050505]': 'text-slate-800',
    'bg-[#050505]': 'bg-slate-800',
    'border-[#050505]': 'border-slate-800',
    '[#050505]': 'slate-800',
    
    'text-[#1877F2]': 'text-blue-600',
    'bg-[#1877F2]': 'bg-blue-600',
    'border-[#1877F2]': 'border-blue-600',
    '[#1877F2]': 'blue-600',
    
    'text-[#65676B]': 'text-slate-500',
    'bg-[#65676B]': 'bg-slate-500',
    '[#65676B]': 'slate-500',
    
    'bg-[#F0F2F5]': 'bg-slate-50',
    '[#F0F2F5]': 'slate-50',
    
    'bg-[#E7F3FF]': 'bg-blue-50',
    '[#E7F3FF]': 'blue-50',
    
    'bg-[#F8F9FA]': 'bg-slate-50',
    '[#F8F9FA]': 'slate-50',
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
        
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed remaining in {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
