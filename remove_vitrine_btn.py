import re

with open('src/components/auth/LoginPortal.tsx', 'r') as f:
    content = f.read()

# Remove the "Vitrine EDU-CONGO" button in the header
button_pattern = r'<button\s*id="btn-login-vitrine-link".*?</button>'
content = re.sub(button_pattern, '', content, flags=re.DOTALL)

# We can keep `handleBackToVitrine` on the logo just to do nothing or act as a refresh
content = content.replace(
    'onClick={handleBackToVitrine}',
    'onClick={() => window.location.reload()}'
)
content = content.replace(
    'title="Accéder au portail vitrine officiel EDU-CONGO"',
    'title="Actualiser la page"'
)

with open('src/components/auth/LoginPortal.tsx', 'w') as f:
    f.write(content)
