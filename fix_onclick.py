with open('src/components/auth/LoginPortal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="p-2 text-slate-500 hover:text-slate-800',
    'onClick={() => window.location.reload()} className="p-2 text-slate-500 hover:text-slate-800'
)

with open('src/components/auth/LoginPortal.tsx', 'w') as f:
    f.write(content)
