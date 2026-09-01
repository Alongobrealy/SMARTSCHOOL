import re

with open('src/components/auth/LoginPortal.tsx', 'r') as f:
    content = f.read()

# Fix role labels
content = content.replace("label: 'Espace Elèvess & Étudiants',", "label: 'Espace Elèves',")
content = content.replace("label: 'Espace Élèves',", "label: 'Espace Elèves',")

# Fix footer background to be always blue
content = content.replace('bg-blue-600 dark:bg-blue-900', 'bg-blue-600')

# Fix header background to be blue
# Look for header className
header_pattern = r'<header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-3\.5 sm:py-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 border-b border-slate-200\s+backdrop-blur-xl bg-white/90\s+transition-colors text-center sm:text-left">'
header_replacement = '<header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 border-b border-blue-500 bg-blue-600 transition-colors text-center sm:text-left shadow-md">'
content = re.sub(header_pattern, header_replacement, content)

# Header text needs to be white if bg is blue
content = content.replace('text-slate-800  group-hover:text-blue-600', 'text-white group-hover:text-blue-100')
content = content.replace('text-slate-500  font-medium tracking-tight mt-0.5', 'text-blue-100 font-medium tracking-tight mt-0.5')
content = content.replace('bg-blue-600  text-blue-600  border border-slate-200 text-[10px]', 'bg-white/20 text-white border border-white/30 text-[10px]')
content = content.replace('bg-blue-600 animate-pulse', 'bg-white animate-pulse')

# Fix refresh button action
# Replace onClick={() => window.location.reload()} with resetting state
refresh_button = r'onClick=\{\(\) => window\.location\.reload\(\)\} className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm"'
refresh_replacement = r'''onClick={() => {
              setSelectedRole('direction');
              setIdentifier('');
              setPassword('');
              setErrorMessage(null);
              setPinSetupError(null);
            }} className="p-2 text-white hover:text-blue-100 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20 cursor-pointer shadow-sm"'''
content = re.sub(refresh_button, refresh_replacement, content)

with open('src/components/auth/LoginPortal.tsx', 'w') as f:
    f.write(content)

