import re

for filepath in ['src/components/modules/DeveloperSuperAdminModule.tsx', 'src/components/modals/DeveloperAuthModal.tsx']:
    with open(filepath, 'r') as f:
        content = f.read()

    # Apply font-display to primary blue buttons
    content = re.sub(
        r'text-sm font-semibold flex items-center',
        r'font-display text-sm font-bold flex items-center',
        content
    )
    content = re.sub(
        r'text-sm font-semibold shadow-lg',
        r'font-display text-sm font-bold shadow-lg',
        content
    )
    # Primary modal buttons
    content = re.sub(
        r'text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all',
        r'font-display text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all active:scale-95',
        content
    )
    # Secondary buttons in modal
    content = re.sub(
        r'bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold transition-colors cursor-pointer border border-slate-200/60',
        r'bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-display text-sm font-bold transition-all cursor-pointer border border-slate-200/60 active:scale-95',
        content
    )

    with open(filepath, 'w') as f:
        f.write(content)

