# create list
numberList = [1, 4, 1, 2, 5]
nameList = ["John", "Mary", "Bob"]
mixedList = [1, "Hello", 3.14, "Last"]
inceptList = [[1, 2, 3, 4, 5], ["John", "Mary", "Bob"], "Last"]

print("----print lists----")
print(numberList)
print(nameList)
print(mixedList)

print("----access list elements----")
print("numberList[0] = " + str(numberList[0]))
print("nameList[1] = " + nameList[1])
print("mixedList[-1] = " + mixedList[-1])
print("inceptList[0][2] = " + str(inceptList[0][2]))

# slice L[start:stop:Step]
print("----list slicing----")
print("numberList[1:4] = " + str(numberList[1:4]))

print("----add elements----")

# .copy() copy list
newList = numberList.copy()
print("newList = " + str(newList))

# append() list + element
nameList.append("Alice")
print(nameList)

# extend() list + list
numberList.extend([6, 7, 8])
print(numberList)

# .remove() remove elements
numberList.remove(2)
print(numberList)

# .pop() remove element and return it
p = nameList.pop(2)
print("Popped element: " + p)
print(nameList)

# .clear() remove all elements
mixedList.clear()
print(mixedList)

# .del() delete list or element
del inceptList
print("inceptList deleted")

# len() length of list
print("Length of numberList = " + str(len(numberList)))

# .count() count occurrences of element
print("Count of 1 in numberList = " + str(numberList.count(1)))

# .index() index of element first occurrence
print("Index of 5 in numberList = " + str(newList.index(2)))

# .sort() sort list ascending
sortNumber = numberList.copy()
sortNumber.sort()
print("Sorted numberList = " + str(sortNumber))

reSortNumber = numberList.copy()
reSortNumber.sort(reverse = True)
print("Sorted numberList (desc) = " + str(reSortNumber))

keyLenList = ["Apple", "Banana", "Kiwi", "Pineapple", "Grape"]
keyLenList.sort(key = len, reverse = True)
print("Sorted keyLenList = " + str(keyLenList))

# .sorted() sort list ascending
sortedNumber = sorted(numberList)
print("Sorted numberList = " + str(sortedNumber))

# loop list
print("----loop list----")
for i in numberList:
    print("numberList : " + str(i))

# * loop list
print("----loop list *----")
print(*numberList, sep = "\n")

# list comprehension
List = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print("list = " + str(List))
comList = [x for x in List if x % 2 == 0]
print("comList = " + str(comList))