import sys

def check(file_path):
    with open(file_path, 'r') as f:
        text = f.read()

    stack = []
    lines = text.split('\n')
    
    in_string = False
    in_comment = False
    string_char = ''
    
    for i, line in enumerate(lines):
        for j, char in enumerate(line):
            if not in_string and not in_comment:
                if char == '/' and j + 1 < len(line) and line[j+1] == '/':
                    break
                elif char == '/' and j + 1 < len(line) and line[j+1] == '*':
                    in_comment = True
                elif char in ('"', "'", '`'):
                    in_string = True
                    string_char = char
                elif char == '{':
                    stack.append(('{', i+1, j+1))
                elif char == '}':
                    if stack and stack[-1][0] == '{':
                        stack.pop()
                    else:
                        print(f"Unmatched }} at line {i+1}")
            elif in_string:
                if char == string_char:
                    if j == 0 or line[j-1] != '\\':
                        in_string = False
            elif in_comment:
                if char == '*' and j + 1 < len(line) and line[j+1] == '/':
                    in_comment = False

    if stack:
        for item in stack:
            print(f"Unclosed {item[0]} at line {item[1]}:{item[2]}")
    else:
        print("All matched!")

check('src/components/DashboardLayout.tsx')
