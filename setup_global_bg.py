import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the root div of App.tsx
if 'Background Ambience Grid & Glows' not in content:
    content = re.sub(
        r'<div className="min-h-screen bg-slate-50 text-\[\#1E293B\] font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200">',
        r'''<div className="min-h-screen bg-slate-50 text-[#1E293B] font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200 relative z-0">
      {/* Global Background Ambience Grid & Glows */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#6366f1_1.2px,transparent_1.2px)] [background-size:28px_28px] -z-10"></div>
      <div className="fixed top-0 left-0 w-[40rem] h-[40rem] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-0 w-[40rem] h-[40rem] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none -z-10"></div>
''',
        content
    )

with open('src/App.tsx', 'w') as f:
    f.write(content)
