TF1 = open("TextFile1.txt", "w", encoding="utf-8")
TF1.write("1 \n")
TF1.write("2.\n")
TF1.write("3.\n")

TF2 = open("TextFile1.txt", "a", encoding="utf-8")
TF2.writelines(["4.\n", "5.\n", "6.\n"])

TF1.close()
TF2.close()

