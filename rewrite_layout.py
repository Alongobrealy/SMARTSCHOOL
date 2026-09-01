import re

with open('src/components/DashboardLayout.tsx', 'r') as f:
    text = f.read()

# 1. Replace the outer container and sidebar layout
# Find the start of the return block
start_idx = text.find('  return (\n    <div className="min-h-screen')

# Find the end of the sidebar (where the main content starts)
# Look for <main className="flex-1 flex flex-col min-w-0">
# Wait, currently it is:
# <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col md:flex-row gap-6">
#   <aside ...>
#   <main className="flex-1 flex flex-col min-w-0">

# Let's extract the sidebar content dynamically to avoid losing anything.
logo_header_start = text.find('{/* Logo Header inside sidebar */}')
nav_links_start = text.find('{/* Navigation Links */}')
user_profile_start = text.find('{/* User Profile Card at bottom of sidebar */}')
sidebar_end = text.find('</aside>', user_profile_start)

logo_header = text[logo_header_start:nav_links_start]
nav_links = text[nav_links_start:user_profile_start]
# We need to grab up to </aside> for the user profile
user_profile = text[user_profile_start:sidebar_end]

dev_banner_start = text.find('{/* DEVELOPER CONTROL MODE BANNER WITH RETURN BUTTON */}')
dev_banner_end = text.find('{/* App Body (Sidebar + Content) */}')
dev_banner = text[dev_banner_start:dev_banner_end]

network_banner = '{/* Global Offline Network Status Banner */}\n      <NetworkStatusBanner variant="banner" />'

# Now construct the new layout
new_layout = f"""  return (
    <div className="h-screen w-full bg-[#F0F2F5] text-[#1E293B] flex font-sans overflow-hidden transition-colors duration-200">
      
      {{/* Mobile Menu Toggle (Floating) */}}
      <button
        onClick={{() => setMobileMenuOpen(!mobileMenuOpen)}}
        className="md:hidden fixed bottom-4 right-4 z-50 p-4 rounded-full bg-[#1877F2] text-white shadow-lg cursor-pointer hover:bg-[#166FE5] transition-colors"
      >
        {{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}}
      </button>

      {{/* Sidebar Nav */}}
      <aside className={{`w-64 bg-white border-r border-[#E4E6EB] flex flex-col h-full shrink-0 z-40 transition-transform duration-300 ${{mobileMenuOpen ? 'fixed inset-y-0 left-0 shadow-2xl' : 'hidden md:flex'}}`}}>
{logo_header}
{nav_links}
{user_profile}
      </aside>

      {{/* Main Content Area */}}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
{network_banner}

{dev_banner}

        {{/* TOP CONTENT HEADER (Blue) */}}
        <header className="h-14 bg-[#1877F2] text-white px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
             <h1 className="font-bold text-sm sm:text-base hidden sm:block">
               {{navItems.find(i => i.id === activeTab)?.label || 'Tableau de Bord'}}
             </h1>
             <span className="sm:hidden font-bold text-sm">EDU-CONGO</span>
          </div>
          <div className="flex items-center gap-3">
             {{/* Profile / School Name */}}
             <div className="flex flex-col text-right hidden xs:flex">
                <span className="text-[10px] text-white/80 uppercase tracking-widest leading-tight">{{roleConfig[currentRole].label}}</span>
                <span className="text-xs font-bold leading-tight truncate max-w-[150px] sm:max-w-[200px]">{{schoolConfig.name || schoolName}}</span>
             </div>
             <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center border border-white/30">
               {{React.createElement(roleConfig[currentRole].icon, {{ className: 'w-4 h-4 text-white' }})}}
             </div>
          </div>
        </header>

        {{/* Scrollable Workspace */}}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F0F2F5]">
"""

# Replace in text
# We need to find where to end the replacement. 
# It replaces from `  return (` up to `<LicenseWarningBanner licenseInfo={licenseInfo} />`
end_idx = text.find('            <LicenseWarningBanner licenseInfo={licenseInfo} />')
if end_idx != -1:
    # Also need to find where the flex container was previously closed.
    # Currently, at the very end of the file there are 3 closing divs:
    #         </AccessGuard>
    #       </div>
    #     </main>
    #   </div>
    # </div>
    # );
    
    text = text[:start_idx] + new_layout + text[end_idx:]
    
    # We also need to fix the closing tags at the end of the file.
    # We removed `<div className="max-w-7xl...` and `<main ...>` from the wrapper, but added `<main>` and `<div overflow-y-auto>`. So the number of closing divs is actually the same!
    
    with open('src/components/DashboardLayout.tsx', 'w') as f:
        f.write(text)
    print("Layout replaced successfully!")
else:
    print("Could not find LicenseWarningBanner to anchor replacement.")
