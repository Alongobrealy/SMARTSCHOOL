import re
with open('src/components/modals/DeveloperAuthModal.tsx', 'r') as f:
    content = f.read()

# Check if glows exist
if 'Background Ambience Grid & Glows' not in content:
    content = re.sub(
        r'<div className="relative bg-white/95 backdrop-blur-2xl w-full max-w-md rounded-3xl border border-slate-200/60 shadow-2xl overflow-hidden flex flex-col my-6">',
        r'''
      {/* Background Ambience Grid & Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#6366f1_1.2px,transparent_1.2px)] [background-size:28px_28px]"></div>
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none -z-10"></div>
      <div className="relative bg-white/95 backdrop-blur-2xl w-full max-w-md rounded-3xl border border-slate-200/60 shadow-2xl overflow-hidden flex flex-col my-6">
''',
        content
    )

with open('src/components/modals/DeveloperAuthModal.tsx', 'w') as f:
    f.write(content)
