with open('src/components/DashboardLayout.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    # If a line ends with ' or '\n, where the ' is not part of a valid string, remove it.
    stripped = line.rstrip('\r\n')
    if stripped.endswith("'"):
        # Check if it's an unclosed string
        # Very simple heuristic: if it's an import or interface or JSX tag end
        if stripped.startswith('import ') or stripped.endswith("{'") or stripped.endswith(",'") or stripped.endswith(";'"):
            lines[i] = stripped[:-1] + '\n'
        elif stripped.endswith(" {'"):
            lines[i] = stripped[:-2] + ' {\n'

with open('src/components/DashboardLayout.tsx', 'w') as f:
    f.writelines(lines)
