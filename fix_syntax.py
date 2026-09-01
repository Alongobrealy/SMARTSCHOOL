import re

with open('src/components/auth/LoginPortal.tsx', 'r') as f:
    content = f.read()

# Fix the orphaned "Portail Sécurisé </span>"
content = content.replace(
    '              \n                Portail Sécurisé\n              </span>',
    ''
)

# And fix any extra `</header>` vs `<header>` mismatches. Wait, earlier there were errors:
# /app/applet/src/components/auth/LoginPortal.tsx:476:8: ERROR: Unexpected closing "header" tag does not match opening "div" tag
# /app/applet/src/components/auth/LoginPortal.tsx:478:6: ERROR: Expected ")" but found "{"

# Let's inspect around 476.
# It seems the `div` on 464 is not closed properly? No, 461 `</div>` closes the left part.
# Then 464 `<div className="flex items-center justify-center gap-2.5 sm:gap-3">`
# Then the button on 465..471
# Then some blank lines 472..474
# Then `</div>` on 475? Wait, the earlier output for grep showed no `</div>` before `</header>`.
