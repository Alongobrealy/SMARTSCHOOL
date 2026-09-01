with open('src/components/DashboardLayout.tsx', 'r') as f:
    text = f.read()

# Update Nav Section Header
text = text.replace(
    'text-[10px] font-bold uppercase tracking-widest text-[#65676B] px-3 py-1',
    'text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 py-1'
)

# Update Active/Inactive Nav Link styles
old_active = "'bg-[#1877F2] text-white font-semibold shadow-md shadow-sm'"
new_active = "'bg-[#2563EB] text-white font-semibold shadow-sm'"

old_inactive = "'text-[#65676B] hover:text-white hover:bg-[#F0F2F5]'"
new_inactive = "'text-slate-400 hover:text-white hover:bg-slate-800'"

text = text.replace(old_active, new_active)
text = text.replace(old_inactive, new_inactive)

with open('src/components/DashboardLayout.tsx', 'w') as f:
    f.write(text)
