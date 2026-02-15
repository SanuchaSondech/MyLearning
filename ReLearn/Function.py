# Function no parameter no return
def Hello():
    print("Hello World")

Hello()

# Function with parameter no return
def SumFunc(a, b):
    sum = a + b
    print("a + b = ", sum)

SumFunc(5, 10)

# Function with parameter with return
def SumReturn(a, b):
    sum = a + b
    return sum

r = SumReturn(10, 10)
print("a + b = ", r)

# Function no parameter with return
def Pi():
    return 3.14159

r = Pi()
print("Pi = ", r)
print("Area of circle with radius 5 = ", Pi() * 5 * 5)
