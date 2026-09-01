import re

with open('src/components/DashboardLayout.tsx', 'r') as f:
    content = f.read()

# Remove the floating mobile menu toggle
content = re.sub(
    r'\{/\* Mobile Menu Toggle \*/\}.*?</button>',
    '',
    content,
    flags=re.DOTALL
)

# Import ThemeToggle and RefreshCw, Upload if not present
if 'ThemeToggle' not in content:
    content = content.replace("import {", "import { ThemeToggle } from './ThemeToggle';\nimport {", 1)
if 'Upload,' not in content:
    content = content.replace("  CheckCircle2,", "  Upload,\n  RefreshCw,\n  CheckCircle2,", 1)
else:
    if 'RefreshCw' not in content:
        content = content.replace("  Upload,", "  Upload,\n  RefreshCw,", 1)

# Modify Sidebar background to be solid or glassy slate-900 (user wants dark mode support)
# Wait, the prompt says: "Ajouter un bouton de bascule pour le thème sombre/clair dans le DashboardLayout, en utilisant le ThemeContext et en garantissant que toutes les cartes et interfaces respectent les couleurs définies dans le fichier index.css pour le mode dark."
# The sidebar currently uses hardcoded dark colors: `bg-[#0F172A] border-r border-[#1E293B] text-white/slate-300`
content = re.sub(
    r'className=\{`w-64 bg-\[\#0F172A\] border-r border-\[\#1E293B\] flex flex-col h-full shrink-0 z-40 transition-transform duration-300 \$\{mobileMenuOpen \? \'fixed inset-y-0 left-0 shadow-2xl\' : \'hidden md:flex\'\}`\}',
    r'className={`w-64 bg-slate-900/95 backdrop-blur-2xl border-r border-slate-800 flex flex-col h-full shrink-0 z-40 transition-transform duration-300 ${mobileMenuOpen ? \'fixed inset-y-0 left-0 shadow-2xl\' : \'hidden md:flex\'}`}',
    content
)

# Modify Header to be visible on mobile, have ThemeToggle, RefreshCw, Upload logo space
new_header = """        {/* Top Header */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 transition-colors">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <label className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Uploader un logo">
                        <Upload className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        <input type="file" className="hidden" accept="image/*" />
                    </label>
                    <h1 className="font-display font-bold text-lg sm:text-xl text-gray-800 dark:text-gray-100 tracking-tight hidden sm:block">Portail Académique</h1>
                </div>
                <span className="hidden lg:inline-block px-3 py-1 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full uppercase tracking-wider ml-2">Année 2024-2025</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
                <button onClick={() => window.location.reload()} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full relative transition-colors cursor-pointer" title="Réactualiser">
                    <RefreshCw className="w-5 h-5" />
                </button>
                <ThemeToggle variant="icon" />
                <div className="relative hidden md:block ml-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 lg:w-64 transition-all text-gray-700 dark:text-gray-200" />
                </div>
            </div>
        </header>"""

content = re.sub(
    r'\{\/\* Top Header \*\/\}.*?</header>',
    new_header,
    content,
    flags=re.DOTALL
)

with open('src/components/DashboardLayout.tsx', 'w') as f:
    f.write(content)

