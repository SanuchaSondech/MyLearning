TF = open("TextFile1.txt", "r", encoding="utf-8")
TF1 = TF.read()
print(TF1)

print("___________________")

TF = open("TextFile1.txt", "r", encoding="utf-8")
TF2 = TF.readline()
print(TF2)

print("___________________")

TF = open("TextFile1.txt", "r", encoding="utf-8")
TF3 = TF.readlines()
print(TF3)

TF.close