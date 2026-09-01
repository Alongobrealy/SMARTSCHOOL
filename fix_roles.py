import re

files = [
    'src/components/DashboardLayout.tsx',
    'src/components/auth/LoginPortal.tsx',
    'src/data/initialData.ts'
]

replacements = {
    'Direction Générale': 'Direction Générale et Administration',
    'Secrétariat & Scolarité': 'Secrétariat et Scolarité',
    'Service Comptabilité & Caisse': 'Comptabilité et Caisse',
    'Espace Professeur': 'Corps Enseignant et Personnel',
    'Espace Parents d’Élèves': 'Espace Parents',
    'Espace Élève': 'Espace Elèves',
    'Caisse & Comptabilité': 'Comptabilité et Caisse',
    'Comptabilité & Caisse': 'Comptabilité et Caisse'
}

for file in files:
    try:
        with open(file, 'r') as f:
            content = f.read()
        
        for k, v in replacements.items():
            content = content.replace(k, v)
            
        with open(file, 'w') as f:
            f.write(content)
    except FileNotFoundError:
        pass
