import re

with open('/tmp/layout.txt', 'r') as f:
    orig_text = f.read()

anchor = '  const currentStudent = scopedStudents[0] || students[0]; // For parent / eleve view'
anchor_idx = orig_text.find(anchor)
if anchor_idx != -1:
    start_idx = orig_text.find('  return (', anchor_idx)
else:
    print("Could not find anchor")
    exit(1)

new_sidebar_and_header = """  return (
    <div className="h-screen w-full bg-[#F3F4F6] text-[#1E293B] flex font-sans overflow-hidden">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed bottom-4 right-4 z-50 p-4 rounded-full bg-blue-600 text-white shadow-lg cursor-pointer hover:bg-blue-700 transition-colors"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`w-64 bg-[#0F172A] border-r border-[#1E293B] flex flex-col h-full shrink-0 z-40 transition-transform duration-300 ${mobileMenuOpen ? 'fixed inset-y-0 left-0 shadow-2xl' : 'hidden md:flex'}`}>
        
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-[#1E293B]">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">EduERP Pro</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 flex flex-col gap-1.5 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'opacity-80'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[#1E293B] bg-slate-900/50">
          <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-xl border border-slate-700">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentRole}&backgroundColor=c0aede,b6e3f4,d1d4f9`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">{roleConfig[currentRole].label}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider truncate">admin@eduerp.com</span>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
             <button
                onClick={onBackToFlyer}
                className="flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                title="Retour Vitrine"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onLogout || onBackToFlyer}
                className="flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 hidden md:flex">
            <div className="flex items-center gap-4">
                <h1 className="font-bold text-xl text-gray-800">Portail Académique</h1>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Année 2024-2025</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Rechercher un élève..." className="pl-9 pr-4 py-2 bg-gray-100 border-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all text-gray-700" />
                </div>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors cursor-pointer">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
            </div>
        </header>

        {/* Global Offline Network Status Banner */}
        <NetworkStatusBanner variant="banner" />

        {/* DEVELOPER CONTROL MODE BANNER WITH RETURN BUTTON */}
        {isDevUnlocked && currentRole !== 'superadmin' && (
          <div className="bg-amber-500 border-b border-amber-600 px-4 sm:px-6 py-2.5 shadow-md flex items-center justify-between gap-3 text-amber-950">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Terminal className="w-4 h-4" />
              Mode Simulation: {roleConfig[currentRole].label}
            </div>
            <button
              onClick={() => {
                onChangeRole('superadmin');
                setActiveTab('superadmin');
              }}
              className="px-3 py-1 bg-amber-950 text-amber-400 rounded-lg text-xs font-bold hover:bg-black transition-colors cursor-pointer"
            >
              Quitter la Simulation
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
"""

content_start_str = '<div className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">'
content_start_idx = orig_text.find(content_start_str)

if start_idx != -1 and content_start_idx != -1:
    text = orig_text[:start_idx] + new_sidebar_and_header + orig_text[content_start_idx + len(content_start_str):]
    with open('src/components/DashboardLayout.tsx', 'w') as f:
        f.write(text)
    print("DashboardLayout restored and updated!")
else:
    print("Boundaries not found in orig_text")
