import re

with open('src/components/auth/LoginPortal.tsx', 'r') as f:
    content = f.read()

# 1. Import Upload
if 'Upload,' not in content:
    content = content.replace('ShieldCheck,', 'ShieldCheck,\n  Upload,', 1)

# 2. Add Logo Upload to Header
header_right_side = r'(<ThemeToggle variant="pill" showLabel=\{true\} />)'
header_right_side_replacement = r'''\1
          <label className="ml-2 w-10 h-10 sm:w-11 sm:h-11 bg-slate-100 dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Uploader un logo personnalisé">
              <Upload className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input type="file" className="hidden" accept="image/*" />
          </label>'''
content = re.sub(header_right_side, header_right_side_replacement, content)

# 3. Remove "Role Selector Grid" entirely
role_selector_start = r'\{\/\* Role Selector Grid \*\/\}.*?(?=\{\/\* Login Box \*\/\})'
content = re.sub(role_selector_start, '', content, flags=re.DOTALL)

# 4. Modify "Login Box" and replace "Header of Active Role" with a dropdown
login_box_header_start = r'\{\/\* Header of Active Role - Centré sur mobile \*\/\}.*?(?=\{\/\* Error & Success Banners \*\/\})'
dropdown_replacement = r'''{/* Role Selector Dropdown */}
          <div className="mb-5 sm:mb-6">
            <label className="text-slate-800 dark:text-slate-100 font-bold mb-1.5 flex items-center justify-between text-xs sm:text-sm">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" /> 
                Profil utilisateur :
              </span>
              <span className="text-[10px] text-blue-600 bg-blue-50 dark:bg-blue-900/30 font-bold px-2.5 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                Vérifié
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <currentRoleConfig.icon className="w-5 h-5 text-blue-600" />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => {
                  const r = e.target.value as UserRole;
                  setSelectedRole(r);
                  setIdentifier('');
                  setPassword('');
                  setErrorMessage(null);
                  setPinSetupError(null);
                }}
                className="w-full bg-slate-50/50 hover:bg-white focus:bg-white dark:bg-slate-900 dark:hover:bg-slate-800 dark:focus:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 rounded-xl pl-11 pr-10 py-3 text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none cursor-pointer"
              >
                {rolesConfig.filter(r => r.role !== 'superadmin' || showDevSecretTab).map(r => (
                  <option key={r.role} value={r.role}>{r.label} - {r.category}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1.5 ml-1">
              {currentRoleConfig.securityNote}
            </p>
          </div>
          
          '''
content = re.sub(login_box_header_start, dropdown_replacement, content, flags=re.DOTALL)

# 5. Clean up the Login Box styling (reduce blur, ensure solid colors)
content = content.replace(
    'className="w-full max-w-xl bg-white/95 border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative transition-all hover:shadow-blue-600/10"',
    'className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative transition-all"'
)

with open('src/components/auth/LoginPortal.tsx', 'w') as f:
    f.write(content)

