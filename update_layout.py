import re

with open('src/components/DashboardLayout.tsx', 'r') as f:
    text = f.read()

# 1. Update aside (Sidebar)
text = re.sub(
    r'<aside className=\{`w-64 bg-white border-r border-\[#E4E6EB\]',
    r'<aside className={`w-64 bg-[#0F172A] border-r border-[#1E293B] text-slate-300',
    text
)

# 2. Update sidebar header (Logo)
# We need to find the logo header inside aside
text = re.sub(
    r'<div className="p-4 sm:p-5 flex items-center gap-3 border-b border-\[#E4E6EB\]">',
    r'<div className="p-4 sm:p-5 flex items-center gap-3 border-b border-[#1E293B]">',
    text
)
# Make the EC logo have white text/icon (it already might)
text = re.sub(
    r'<span className="font-display font-black text-lg tracking-tight text-\[#050505\] truncate">',
    r'<span className="font-display font-black text-lg tracking-tight text-white truncate">',
    text
)

# 3. Update nav links
# They are mapped. Let's find the NavLink block.
nav_link_pattern = r'<button\s*key=\{item\.id\}[^>]*onClick=\{[^}]*\}[^>]*className=\{`([^`]+)`\}'
# We need to change the classNames for the nav items.
# Current: `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ...`
# Let's replace the whole nav link rendering block.

# First, extract it to see how it looks
with open('src/components/DashboardLayout.tsx', 'w') as f:
    f.write(text)
