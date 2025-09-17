import csv
with open("FileCsv.csv", "w", encoding="utf-8", newline="\n") as FileCsv :
    TW = csv.writer(FileCsv)
    TW.writerow(["ชื่อ", "อายุ", "เพศ"])
    TW.writerow(["โซดา", "19", "ชาย"])
    TW.writerow(["ก้อง", "19", "ชาย"])
    TW.writerow(["ต้นกล้า", "20", "ชาย"])
    TW.writerow(["ไผ่", "20", "หญิง"])
with open("FileCsv.csv", "a", encoding="utf-8", newline="\n") as FileCsv :
    MyData = [["Jane", "20", "หญิง"] ,["Mark", "21", "ชาย"] ,["Por", "22", "ชาย"]]
    TA = csv.writer(FileCsv)
    TA.writerows(MyData)