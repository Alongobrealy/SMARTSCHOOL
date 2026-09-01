import re

with open('src/components/auth/LoginPortal.tsx', 'r') as f:
    content = f.read()

# 1. Remove the label from the right side
upload_label = r'<label className="ml-2 w-10 h-10 sm:w-11 sm:h-11 bg-slate-100 dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Uploader un logo personnalisé">[\s\S]*?</label>'
content = re.sub(upload_label, '', content)

# 2. Replace the left-side button with a div
content = content.replace(
    '''<button
          id="btn-login-brand-vitrine"
          type="button"
          onClick={() => window.location.reload()}
          className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2.5 sm:gap-3.5 text-center sm:text-left group cursor-pointer transition-all hover:opacity-90 active:scale-98 focus:outline-none rounded-lg p-1 -m-1"
          title="Actualiser la page"
        >''',
    '''<div
          className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2.5 sm:gap-3.5 text-center sm:text-left rounded-lg p-1 -m-1"
        >'''
)
# And replace the closing button
content = content.replace(
    '''</p>
          </div>
        </button>''',
    '''</p>
          </div>
        </div>'''
)

# 3. Replace the EC div with the upload label
ec_div = r'<div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-blue-600 border border-slate-200 flex items-center justify-center font-display font-black text-white text-base sm:text-lg shadow-lg shadow-sm group-hover:scale-105 transition-all shrink-0">\s*EC\s*</div>'
new_upload = '''<label className="w-10 h-10 sm:w-11 sm:h-11 bg-slate-100 dark:bg-slate-800 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 shadow-sm" title="Uploader un logo personnalisé">
            <Upload className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input type="file" className="hidden" accept="image/*" />
          </label>'''
content = re.sub(ec_div, new_upload, content)

with open('src/components/auth/LoginPortal.tsx', 'w') as f:
    f.write(content)
