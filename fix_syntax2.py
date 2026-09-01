with open('src/components/auth/LoginPortal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '                EDU-CONGO\n              </span>\n              \n                Portail Sécurisé\n              </span>\n            </div>',
    '                EDU-CONGO\n              </span>\n            </div>'
)

# And ensure there's a `</div>` before `</header>`
if '          </button>\n          \n          \n          \n        </header>' in content:
    content = content.replace(
        '          </button>\n          \n          \n          \n        </header>',
        '          </button>\n        </div>\n      </header>'
    )
    
# Or maybe the empty lines are different. Let's do regex
import re
content = re.sub(
    r'</button>\s*</header>',
    '</button>\n        </div>\n      </header>',
    content
)

with open('src/components/auth/LoginPortal.tsx', 'w') as f:
    f.write(content)
