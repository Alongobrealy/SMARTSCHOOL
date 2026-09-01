import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        text = f.read()

    original = text

    text = re.sub(r'<table\s+className="[^"]*"', '<table className="w-full text-left border-collapse"', text)
    text = re.sub(r'<table\s*>', '<table className="w-full text-left border-collapse">', text)
    
    text = re.sub(r'<thead\s+className="[^"]*"', '<thead className="bg-[#F8F9FA] border-b border-[#E4E6EB]"', text)
    text = re.sub(r'<thead\s*>', '<thead className="bg-[#F8F9FA] border-b border-[#E4E6EB]">', text)
    
    text = re.sub(r'<th\s+className="[^"]*"', '<th className="px-4 py-3 text-[10px] font-bold text-[#65676B] uppercase tracking-wider whitespace-nowrap"', text)
    text = re.sub(r'<th\s*>', '<th className="px-4 py-3 text-[10px] font-bold text-[#65676B] uppercase tracking-wider whitespace-nowrap">', text)
    
    # Fix duplicated classNames in TH if regex overlapped
    text = re.sub(r'className="[^"]*"\s+className="', 'className="', text)
    
    text = re.sub(r'<tr\s+className="[^"]*"', '<tr className="border-b border-[#E4E6EB] hover:bg-[#F8F9FA] transition-colors"', text)
    text = re.sub(r'<tr\s*>', '<tr className="border-b border-[#E4E6EB] hover:bg-[#F8F9FA] transition-colors">', text)
    
    # Let's fix the header row to not have hover effect
    text = text.replace('<thead className="bg-[#F8F9FA] border-b border-[#E4E6EB]">\n          <tr className="border-b border-[#E4E6EB] hover:bg-[#F8F9FA] transition-colors">', '<thead className="bg-[#F8F9FA] border-b border-[#E4E6EB]">\n          <tr>')
    text = text.replace('<thead className="bg-[#F8F9FA] border-b border-[#E4E6EB]">\n        <tr className="border-b border-[#E4E6EB] hover:bg-[#F8F9FA] transition-colors">', '<thead className="bg-[#F8F9FA] border-b border-[#E4E6EB]">\n        <tr>')

    # Quick and dirty replace td padding if they are standard ones
    text = re.sub(r'<td className="px-4 py-2', '<td className="px-4 py-3 text-sm', text)
    text = re.sub(r'<td className="px-6 py-4', '<td className="px-4 py-3 text-sm', text)
    text = re.sub(r'<td className="p-4', '<td className="px-4 py-3 text-sm', text)
    text = re.sub(r'<td className="p-2', '<td className="px-4 py-3 text-sm', text)
    text = re.sub(r'<td className="p-3', '<td className="px-4 py-3 text-sm', text)
    text = re.sub(r'<td\s*>', '<td className="px-4 py-3 text-sm text-[#050505]">', text)
    
    if text != original:
        with open(filepath, 'w') as f:
            f.write(text)

dirs_to_process = ['src/components/tabs', 'src/components/modals', 'src/components']
for d in dirs_to_process:
    if os.path.exists(d):
        for root, _, files in os.walk(d):
            for f in files:
                if f.endswith('.tsx'):
                    filepath = os.path.join(root, f)
                    if 'Layout' not in f and 'Login' not in f:
                        process_file(filepath)

print("Tables standardized.")
