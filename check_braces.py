with open('src/components/DashboardLayout.tsx', 'r') as f:
    text = f.read()

print("{ :", text.count('{'))
print("} :", text.count('}'))
print("( :", text.count('('))
print(") :", text.count(')'))
