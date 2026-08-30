const fs = require('fs');
const file = 'src/components/modules/SchoolSettingsModule.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add 'subjects' to the activeTab type
code = code.replace("useState<'general' | 'cycles' | 'classes' | 'permissions'>", "useState<'general' | 'cycles' | 'classes' | 'subjects' | 'permissions'>");

// 2. Add the Subjects tab button
const subjectsTabBtn = `
          <button
            onClick={() => setActiveTab('subjects')}
            className={\`pb-3 border-b-2 font-bold text-sm flex items-center gap-2 transition-colors \${
              activeTab === 'subjects'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }\`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Matières & Cours</span>
          </button>
`;

code = code.replace(/<button[^>]*onClick=\{\(\) => setActiveTab\('permissions'\)\}[^>]*>[\s\S]*?<\/button>/, match => subjectsTabBtn + '\n' + match);

// 3. Add the Subjects tab content
const subjectsTabContent = `
      {/* ONGLE MATIÈRES */}
      {activeTab === 'subjects' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Matières d'études
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Gérez la liste officielle des matières enseignées au sein de l'établissement.
              </p>
            </div>
            {currentRole === 'superadmin' || currentRole === 'direction' ? (
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  id="newSubjectInput" 
                  placeholder="Nouvelle matière..." 
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const target = e.target;
                      const val = target.value.trim();
                      if (val) {
                        const newSubjects = [...(schoolConfig.subjects || []), val];
                        onUpdateSchoolConfig({ ...schoolConfig, subjects: newSubjects });
                        target.value = '';
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const target = document.getElementById('newSubjectInput');
                    const val = target?.value.trim();
                    if (val) {
                      const newSubjects = [...(schoolConfig.subjects || []), val];
                      onUpdateSchoolConfig({ ...schoolConfig, subjects: newSubjects });
                      if(target) target.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-2 text-xs shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Ajouter
                </button>
              </div>
            ) : null}
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white">
                  <th className="p-3.5">Nom de la matière</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-xs">
                {(schoolConfig.subjects || []).map((subject, idx) => (
                  <tr key={idx} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">
                      {subject}
                    </td>
                    <td className="p-3.5 text-right">
                      {(currentRole === 'superadmin' || currentRole === 'direction') && (
                        <button
                          onClick={() => {
                            if (window.confirm("Supprimer cette matière ?")) {
                              const newSubjects = (schoolConfig.subjects || []).filter(s => s !== subject);
                              onUpdateSchoolConfig({ ...schoolConfig, subjects: newSubjects });
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {!(schoolConfig.subjects || []).length && (
                  <tr>
                    <td colSpan={2} className="p-6 text-center text-slate-500 text-xs">Aucune matière configurée.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
`;

code = code.replace("{activeTab === 'permissions' && (", subjectsTabContent + "\n      {activeTab === 'permissions' && (");

fs.writeFileSync(file, code);
