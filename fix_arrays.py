import re

with open('src/components/DashboardLayout.tsx', 'r') as f:
    content = f.read()

# Fix the roles arrays which look like ['direction',administration',comptabilite']
# We want to properly quote all of them.
def repl(match):
    # The inside of the array
    inner = match.group(1)
    # Split by comma
    parts = inner.split(',')
    # Quote each part
    quoted_parts = ["'" + p.strip().strip("'") + "'" for p in parts]
    return "roles: [" + ", ".join(quoted_parts) + "]"

content = re.sub(r'roles:\s*\[(.*?)\]', repl, content)

with open('src/components/DashboardLayout.tsx', 'w') as f:
    f.write(content)
