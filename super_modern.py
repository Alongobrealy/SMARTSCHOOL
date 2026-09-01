import os
import re

def aggressive_replace(content):
    # Any bg-white with rounded-lg -> rounded-2xl
    content = re.sub(r'bg-white\s+([a-zA-Z0-9_:\s-]*)rounded-lg', r'bg-white \1rounded-2xl', content)
    content = re.sub(r'rounded-lg\s+bg-white', r'rounded-2xl bg-white', content)
    
    # Any border-slate-200 that is not border-slate-200/60 -> border-slate-200/60
    content = re.sub(r'border-slate-200(?!/60)', r'border-slate-200/60', content)
    
    # All hover:bg-blue-600 -> hover:bg-blue-700
    content = content.replace('hover:bg-blue-600', 'hover:bg-blue-700')
    
    # Buttons: bg-blue-600 text-white rounded-xl text-xs -> text-sm font-semibold
    content = re.sub(
        r'bg-blue-600(.*?)text-white(.*?)text-xs(.*?)font-bold',
        r'bg-blue-600\1text-white\2text-sm\3font-semibold shadow-md shadow-blue-600/20',
        content
    )
    
    # w-11 h-11 -> w-12 h-12 for icon containers
    content = re.sub(r'w-11\s+h-11\s+rounded-xl', r'w-12 h-12 rounded-2xl', content)
    content = re.sub(r'w-11\s+h-11\s+rounded-lg', r'w-12 h-12 rounded-2xl', content)
    
    # p-4 sm:p-6 -> p-6 sm:p-8
    content = re.sub(r'p-4\s+sm:p-6', r'p-6 sm:p-8', content)
    
    # Table headers text-xs -> text-sm ? Maybe keep text-xs but make it uppercase tracking-wider
    
    return content

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = aggressive_replace(content)
    
    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Aggressively upgraded styles in {filepath}")

for root, _, files in os.walk('src/components/modules'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))

# Let's also do DashboardLayout and others
for file in ['src/components/DashboardLayout.tsx', 'src/App.tsx']:
    if os.path.exists(file):
        process_file(file)

