# MyLearning

คลังรวมโค้ดและโปรเจคฝึกเขียนโปรแกรมของ Sanucha Sondech จัดหมวดหมู่ตามภาษาและเฟรมเวิร์ก พร้อม `.gitignore` ที่สะอาดสำหรับ clone ไปรันต่อได้ทันที

## โครงสร้างโฟลเดอร์ (Repository Structure)

```text
MyLearning/
├── html-css/                  # แบบฝึกหัดและโปรเจค HTML, CSS, Bootstrap, jQuery, DOM
├── java/
│   ├── basics/                # พื้นฐาน Java, OOP, GUI (Swing/MVC), Data Structures & Algorithms
│   └── spring-boot/           # โปรเจค Spring Boot (REST API, CRUD, Booking, BorrowBook, Winest)
├── javascript/
│   ├── basics/                # พื้นฐาน JavaScript, JSON, DOM, Mini-games
│   ├── nodejs/                # แบบฝึกหัด Node.js Backend
│   └── react/                 # โปรเจค React (Vite)
└── python/                    # พื้นฐาน Python, File Handling, Modules, ScoreAnalyzer
```

---

## วิธีใช้งานหลัง Clone (Quick Start)

```bash
git clone https://github.com/SanuchaSondech/MyLearning.git
cd MyLearning
```

### 1. Java & Spring Boot (`java/`)
- **Java Basics (`java/basics/`)**: คอมไพล์และรันด้วย `javac` / `java` หรือเปิดใน IDE (IntelliJ IDEA / VS Code)
- **Spring Boot (`java/spring-boot/<project>/`)**:
  ```bash
  cd java/spring-boot/winestApp
  ./mvnw spring-boot:run   # บน Windows ใช้ mvnw.cmd spring-boot:run
  ```

### 2. JavaScript / Node.js / React (`javascript/`)
- **Node.js (`javascript/nodejs/<project>/`)**:
  ```bash
  cd javascript/nodejs/BE-1NodeJS
  npm install
  node index.js
  ```
- **React (`javascript/react/leaning1/`)**:
  ```bash
  cd javascript/react/leaning1
  npm install
  npm run dev
  ```

### 3. Python (`python/`)
```bash
cd python/Project/ScoreAnalyzer
python Analyzer.py
```

### 4. HTML & CSS (`html-css/`)
เปิดไฟล์ `index.html` ในแต่ละโฟลเดอร์ด้วยเบราว์เซอร์หรือ VS Code Live Server ได้ทันที
