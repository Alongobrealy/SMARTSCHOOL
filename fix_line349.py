with open('src/components/DashboardLayout.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '<aside' in line:
        lines[i] = '      <aside className={`w-64 bg-slate-900/95 backdrop-blur-2xl border-r border-slate-800 flex flex-col h-full shrink-0 z-40 transition-transform duration-300 ${mobileMenuOpen ? "fixed inset-y-0 left-0 shadow-2xl" : "hidden md:flex"}`}>\n'
    
    if line.startswith("'") and ('{' in line or '<' in line or ' ' in line):
        if line.strip() == "'":
            lines[i] = ""
        else:
            lines[i] = line.lstrip("'")
            
    if line.rstrip().endswith("'"):
        # Just remove trailing ' if it's not a string literal assignment
        if not ("='" in line or '="' in line or "('" in line):
            if line.rstrip() == "'":
                lines[i] = "\n"

with open('src/components/DashboardLayout.tsx', 'w') as f:
    f.writelines(lines)
