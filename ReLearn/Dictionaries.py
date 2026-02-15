# create dictionary 
#
# Dict = {key : value}

scoreDict = {"John" : 85, "Mary" : 90, "Bob" : 78}

numDict = {1 : "One", 2 : "Two", 3 : "Three"}

print("----print dictionaries----")
print(scoreDict)
print("numDict[2] = " + numDict[2])

numDict[2] = "Two Updated"
print("After update, numDict[2] = " + numDict[2])

print("Keys of scoreDict: " + str(scoreDict.keys()))
print("Values of scoreDict: " + str(scoreDict.values()))
print("Items of scoreDict: " + str(scoreDict.items()))

numDict.update({4 : "Four"})
print("After add, numDict = " + str(numDict))

newNumDict = numDict.copy()
print("newNumDict = " + str(newNumDict))

numDict.clear()
print("After clear, numDict = " + str(numDict))

# loop dict
for key, value in newNumDict.items():
    print("%s : %s" % (key, value))


# delete dict
del numDict
print("numDict deleted")