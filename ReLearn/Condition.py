# if-else
a = 10
print("----if-else----")    
print

if a > 0:
    print("a is positive")
elif a == 0:
    print("a is zero")
else:
    print("a is negative")

# แสดงค่าที่มากที่สุดและนย้อยที่สุด
print("----max-min----")
max = 0
min = 0

a, b, c = 10, 20, 30
if a >= b and a >= c:
    max = a
elif b >= a and b >= c:
    max = b
else:
    max = c

if a <= b and a <= c:
    min = a
elif b <= a and b <= c:
    min = b
else:
    min = c

print("max =", max)
print("min =", min)