try:
    numA = float(input("Enter A number: "))
    numB = float(input("Enter B number: "))
    print("%.2f / %.2f = %.2f" % (numA, numB, numA / numB))
except ValueError:
    print("Error: Please enter number.")
except ZeroDivisionError:
    print("Error: B cannot be zero.")
else:
    print("No error.")