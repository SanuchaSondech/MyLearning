try:
    Score = int(input("คะแนน : "))
    with open("ScoreText.txt", "w+", encoding="utf-8") as scoreFile :
        
        if (Score >= 50) :
            scoreData = str(Score) + " คะแนนผ่าน"
            scoreFile.write(scoreData)
            scoreFile.write("\n")
        else :
            scoreData = str(Score) + " คะแนนไม่ผ่าน"
            scoreFile.write(scoreData)
            scoreFile.write("\n")
except ValueError:
    print("กรุณาใส่ตัวเลข")