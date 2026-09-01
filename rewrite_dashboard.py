import re

with open('src/components/DashboardLayout.tsx', 'r') as f:
    text = f.read()

# We want to replace the `activeTab === 'dashboard'` content.
start_str = "{/* TAB 1: OVERVIEW DASHBOARD */}"
end_str = "{/* TAB 2: CONFIGURATION & TIMETABLE */}"

start_idx = text.find(start_str)
end_idx = text.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_dashboard = """{/* TAB 1: OVERVIEW DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="flex flex-col gap-6 w-full">
              
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-slate-800">Tableau de bord ERP</h2>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg shadow-sm hover:bg-slate-50 transition-colors text-sm">
                      Télécharger le rapport
                    </button>
                    <button 
                      onClick={() => setActiveTab('eleves')}
                      className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-colors text-sm"
                    >
                      Nouvelle Admission
                    </button>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1 */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Élèves</span>
                    <span className="text-3xl font-black text-slate-800">{scopedStudents.length > 0 ? scopedStudents.length : '2,450'}</span>
                    <span className="text-xs font-semibold text-emerald-500">+12% vs l'an dernier</span>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Personnel</span>
                    <span className="text-3xl font-black text-slate-800">{scopedTeachers.length > 0 ? scopedTeachers.length : '145'}</span>
                    <span className="text-xs font-medium text-slate-400">2 postes à pourvoir</span>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Taux Présence</span>
                      <span className="text-3xl font-black text-slate-800">96.5%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '96.5%' }}></div>
                    </div>
                  </div>
                  {/* Card 4 */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Revenu Mensuel</span>
                    <span className="text-3xl font-black text-slate-800">125M <span className="text-lg">FCFA</span></span>
                    <span className="text-xs font-semibold text-amber-500">75% de l'objectif mensuel</span>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                  {/* Chart 1: Aperçu Financier */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-slate-800">Aperçu Financier</h3>
                      <select className="text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded-md px-2 py-1 outline-none">
                        <option>Cette Année</option>
                      </select>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: 'Jan', in: 4000, out: 2400 },
                          { name: 'Fév', in: 3000, out: 1398 },
                          { name: 'Mar', in: 2000, out: 9800 },
                          { name: 'Avr', in: 2780, out: 3908 },
                          { name: 'Mai', in: 1890, out: 4800 },
                          { name: 'Juin', in: 2390, out: 3800 },
                          { name: 'Jui', in: 3490, out: 4300 },
                        ]} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                          <RechartsTooltip />
                          <Area type="monotone" dataKey="out" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorIn)" />
                          <Area type="monotone" dataKey="in" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorOut)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: Présences Hebdomadaires */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-slate-800">Présences Hebdomadaires</h3>
                      <select className="text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded-md px-2 py-1 outline-none">
                        <option>Toutes les classes</option>
                      </select>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Lun', present: 95, absent: 5 },
                          { name: 'Mar', present: 98, absent: 2 },
                          { name: 'Mer', present: 92, absent: 8 },
                          { name: 'Jeu', present: 96, absent: 4 },
                          { name: 'Ven', present: 90, absent: 10 },
                        ]} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                          <RechartsTooltip cursor={{fill: 'transparent'}} />
                          <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                          <Bar dataKey="absent" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Rest of the dashboard widgets like Quick Actions or Activity Feed can go here if needed, but let's stick to the clean layout for now. */}
                
              </div>
            )}

            """
    
    text = text[:start_idx] + new_dashboard + text[end_idx:]
    
    with open('src/components/DashboardLayout.tsx', 'w') as f:
        f.write(text)
    print("Dashboard tab successfully rewritten!")
else:
    print("Could not find boundaries.")
