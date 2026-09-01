import re

with open('src/components/DashboardLayout.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    s = line.rstrip('\r\n')
    # If the line ends with a single quote, we remove it UNLESS it's a valid JSX prop or valid TS string
    # Let's just use regex: if it ends with `'` and there's no matching `'` earlier in the line (or it's unmatched)
    if s.endswith("'"):
        # Count number of single quotes in the line
        if s.count("'") % 2 != 0:
            lines[i] = s[:-1] + '\n'

with open('src/components/DashboardLayout.tsx', 'w') as f:
    f.writelines(lines)

