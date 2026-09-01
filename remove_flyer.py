import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update viewMode state
content = re.sub(
    r"const \[viewMode, setViewMode\] = useState<'flyer' \| 'login' \| 'app'>\('flyer'\);",
    r"const [viewMode, setViewMode] = useState<'login' | 'app'>('login');",
    content
)

# 2. Remove CommercialFlyer import
content = re.sub(
    r"import \{ CommercialFlyer \} from '\./components/CommercialFlyer';\n?",
    "",
    content
)

# 3. Remove Flyer render block
render_block = """      {viewMode === 'flyer' ? (
        <CommercialFlyer
          onLaunchDemo={handleLaunchDemo}
          onOpenLogin={handleOpenLogin}
          onOpenQuote={() => setShowQuoteModal(true)}
        />
      ) : viewMode === 'login' ? ("""

new_render_block = """      {viewMode === 'login' ? ("""

content = content.replace(render_block, new_render_block)

# 4. We should also remove handleBackToFlyer if it exists or change it to just do nothing / remove the prop if needed,
# But let's look at `onBackToVitrine={handleBackToFlyer}`
content = content.replace("onBackToVitrine={handleBackToFlyer}", "onBackToVitrine={() => setViewMode('login')}")

# Also replace handleBackToFlyer definition:
# const handleBackToFlyer = () => {
#   setViewMode('flyer');
# };
content = re.sub(
    r"const handleBackToFlyer = \(\) => \{\s*setViewMode\('flyer'\);\s*\};\s*",
    "",
    content
)

# 5. handleOpenLogin
# const handleOpenLogin = () => {
#    setViewMode('login');
# };
# If it's used elsewhere, let's keep it, but it was probably passed to CommercialFlyer.

with open('src/App.tsx', 'w') as f:
    f.write(content)
