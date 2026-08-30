import os
import re

def process_file(filepath):
    if 'CommercialFlyer.tsx' in filepath:
        return
        
    with open(filepath, 'r') as f:
        text = f.read()

    original = text

    # Remove dark mode classes
    text = re.sub(r'\bdark:[a-zA-Z0-9_/-]+', '', text)

    # Global Backgrounds
    text = text.replace('bg-[#F1F5F9]', 'bg-[#F0F2F5]')
    text = text.replace('bg-[#0B1120]', 'bg-white')
    text = text.replace('bg-[#0F172A]', 'bg-white')
    text = text.replace('bg-[#070D19]', 'bg-white')
    
    text = re.sub(r'\bbg-slate-900(/[0-9]+)?', 'bg-white', text)
    text = re.sub(r'\bbg-slate-800(/[0-9]+)?', 'bg-white', text)
    text = re.sub(r'\bbg-slate-50\b', 'bg-[#F0F2F5]', text)
    text = re.sub(r'\bbg-slate-100\b', 'bg-[#F0F2F5]', text)

    # Texts
    text = re.sub(r'\btext-slate-900\b', 'text-[#050505]', text)
    text = re.sub(r'\btext-slate-800\b', 'text-[#050505]', text)
    text = re.sub(r'\btext-slate-700\b', 'text-[#050505]', text)
    text = re.sub(r'\btext-slate-600\b', 'text-[#65676B]', text)
    text = re.sub(r'\btext-slate-500\b', 'text-[#65676B]', text)
    text = re.sub(r'\btext-slate-400\b', 'text-[#65676B]', text)
    text = re.sub(r'\btext-slate-300\b', 'text-[#65676B]', text)
    text = re.sub(r'\btext-slate-200\b', 'text-[#65676B]', text)
    
    text = re.sub(r'\btext-indigo-[4-9]00\b', 'text-[#1877F2]', text)
    text = re.sub(r'\btext-emerald-[4-9]00\b', 'text-[#1877F2]', text)
    text = re.sub(r'\btext-indigo-[2-3]00\b', 'text-[#1877F2]', text)
    text = re.sub(r'\btext-emerald-[2-3]00\b', 'text-[#1877F2]', text)

    # Button backgrounds
    text = re.sub(r'\bbg-indigo-[4-9]00(/[0-9]+)?', 'bg-[#1877F2]', text)
    text = re.sub(r'\bbg-emerald-[4-9]00(/[0-9]+)?', 'bg-[#1877F2]', text)
    text = re.sub(r'\bhover:bg-indigo-[4-9]00(/[0-9]+)?', 'hover:bg-[#166FE5]', text)
    text = re.sub(r'\bhover:bg-emerald-[4-9]00(/[0-9]+)?', 'hover:bg-[#166FE5]', text)

    text = re.sub(r'\bbg-indigo-50\b', 'bg-[#E7F3FF]', text)
    text = re.sub(r'\bbg-indigo-100\b', 'bg-[#E7F3FF]', text)
    text = re.sub(r'\bbg-emerald-50\b', 'bg-[#E7F3FF]', text)
    text = re.sub(r'\bbg-emerald-100\b', 'bg-[#E7F3FF]', text)

    # Gradients
    text = re.sub(r'bg-gradient-to-[a-z]+ from-[a-zA-Z0-9_/-]+ via-[a-zA-Z0-9_/-]+ to-[a-zA-Z0-9_/-]+', 'bg-[#1877F2]', text)
    text = re.sub(r'bg-gradient-to-[a-z]+ from-[a-zA-Z0-9_/-]+ to-[a-zA-Z0-9_/-]+', 'bg-[#1877F2]', text)

    # Borders
    text = re.sub(r'\bborder-slate-[0-9]+(/[0-9]+)?', 'border-[#E4E6EB]', text)
    text = re.sub(r'\bborder-indigo-[0-9]+(/[0-9]+)?', 'border-[#E4E6EB]', text)
    text = re.sub(r'\bborder-emerald-[0-9]+(/[0-9]+)?', 'border-[#E4E6EB]', text)

    # Radii
    text = text.replace('rounded-full', 'rounded-lg')
    text = text.replace('rounded-2xl', 'rounded-lg')
    text = text.replace('rounded-3xl', 'rounded-lg')

    if text != original:
        with open(filepath, 'w') as f:
            f.write(text)

for root, _, files in os.walk('src'):
    for f in files:
        if f.endswith('.tsx') or f.endswith('.ts'):
            process_file(os.path.join(root, f))
