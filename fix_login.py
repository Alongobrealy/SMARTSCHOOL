import re

with open('src/components/auth/LoginPortal.tsx', 'r') as f:
    content = f.read()

# 1. Profile names
replacements = {
    'Corps Enseignant & Personnel': 'Corps Enseignant et Personnel',
    'Espace Parents & Tuteurs': 'Espace Parents',
    'Espace Parents d’Élèves': 'Espace Parents'
}
for k, v in replacements.items():
    content = content.replace(k, v)

# 2. Remove "Portail Sécurisé" badge
badge_pattern = r'<span className="bg-blue-600\s+text-blue-600\s+border border-slate-200 text-\[10px\] font-bold px-2 py-0\.5 rounded-lg flex items-center gap-1">.*?</span>'
content = re.sub(badge_pattern, '', content, flags=re.DOTALL)

# 3. Replace ThemeToggle with RefreshCw
if 'RefreshCw' not in content:
    content = content.replace("ShieldCheck,", "ShieldCheck,\n  RefreshCw,")

content = re.sub(
    r'<ThemeToggle.*?(/>|</ThemeToggle>)',
    r'''<button
            onClick={() => window.location.reload()}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm"
            title="Actualiser la page"
          >
            <RefreshCw className="w-5 h-5" />
          </button>''',
    content
)

# Since we moved the refresh button, let's remove it from the logo left button if they don't want two
# Wait, the user said "Mettre le bouton actualisation de la page à la place du bouton ''mode jour'' et le supprimer". 
# The "et le supprimer" means "remove the mode jour button and put refresh there". 
# They might also mean "supprimer le bouton actualisation du logo".
content = content.replace(
    'title="Actualiser la page"\n        >',
    '>'
)
content = content.replace(
    'onClick={() => window.location.reload()}',
    ''
)

# 4. Footer blue band
footer_pattern = r'\{\/\* Footer \*\/\}.*?<footer className="w-full text-center pb-6 z-10 relative mt-auto">.*?<p className="text-slate-500 dark:text-slate-400 text-xs font-medium">.*?&copy; 2025 Système Académique EDU-CONGO\. Tous droits réservés\..*?</p>.*?</footer>'
new_footer = '''{/* Footer */}
        <footer className="w-full text-center mt-auto">
          <div className="bg-blue-600 dark:bg-blue-900 w-full py-3 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <p className="text-white text-xs font-bold tracking-wide">
              &copy; 2025 Système Académique EDU-CONGO. Tous droits réservés.
            </p>
          </div>
        </footer>'''
content = re.sub(footer_pattern, new_footer, content, flags=re.DOTALL)

with open('src/components/auth/LoginPortal.tsx', 'w') as f:
    f.write(content)

