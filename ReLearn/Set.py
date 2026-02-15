# create set
setA = {1, 2, 3, 4, 5}
setB = {"Apple", "Banana", "Cherry"}

print("----print set----")
print(setA)
print(setB)

# add element
setA.add(6)
print("After add, setA = " + str(setA))

# update set
setA.update(setB)
print("After update, setA = " + str(setA))

# remove and discard element
setA.remove(3)
print("After remove, setA = " + str(setA))
setA.discard(10) # no error if element not found
print("After discard, setA = " + str(setA))

setB.clear()
print("After clear, setB = " + str(setB))

# operations
setC = {2, 3, 4, "Apple", 10, 100, 1000, 1000}
print("setA = " + str(setA))
print("setC = " + str(setC))

# union 
u = setA | setC
print("setA | setC = " + str(u))

# intersection
i = setA & setC
print("setA & setC = " + str(i))

# difference
d = setA - setC
print("setA - setC = " + str(d))

# symmetric difference
co = setA ^ setC
print("setA ^ setC = " + str(co))

# .issubset()
print("setA.issubset(setC) = " + str(setA.issubset(setC)))