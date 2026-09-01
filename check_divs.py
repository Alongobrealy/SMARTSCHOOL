with open('src/components/DashboardLayout.tsx', 'r') as f:
    text = f.read()

def count_tags(tag):
    return text.count(f'<{tag}') - text.count(f'</{tag}>')

print("divs:", count_tags('div'))
print("mains:", count_tags('main'))
print("asides:", count_tags('aside'))
print("headers:", count_tags('header'))
