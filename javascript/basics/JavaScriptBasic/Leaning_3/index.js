// ขยับอย่างง่าย
const boxEl = document.querySelector("#box");
console.log(boxEl);

let x = boxEl.offsetLeft;
let y = boxEl.offsetTop;
const step = 10;

// เปลี่ยนตำแหน่ง
function updatePosition() {
    boxEl.style.left = x + "px";
    boxEl.style.top = y + "px";
}

// เมื่อกดปุ่ม
function moveUp() {
    if (!willCollide(x, y - step)) y -= step;
    updatePosition();
}

function moveDown() {
    if (!willCollide(x, y + step)) y += step;
    updatePosition();
}

function moveLeft() {
    if (!willCollide(x - step, y)) x -= step;
    updatePosition();
}

function moveRight() {
    if (!willCollide(x + step, y)) x += step;
    updatePosition();
}

// ชนกำแพง
const wallEl = document.querySelectorAll(".wall");

function willCollide(nextX, nextY) {

    // ตำแหน่งของกล่องที่กำลังจะไป
    const boxPosition = {
        top: nextY,
        bottom: nextY + boxEl.offsetHeight, // offsetHeight = ความสูงของ element
        left: nextX,
        right: nextX + boxEl.offsetWidth
    };

    for (let i = 0; i < wallEl.length; i++) {
        const wall = wallEl[i];

        const wallRect = {
            left: wall.offsetLeft,
            top: wall.offsetTop,
            width: wall.offsetWidth,
            height: wall.offsetHeight
        };
        wallRect.right = wallRect.left + wallRect.width;
        wallRect.bottom = wallRect.top + wallRect.height;

        if (
            boxPosition.right > wallRect.left &&
            boxPosition.left < wallRect.right &&
            boxPosition.bottom > wallRect.top &&
            boxPosition.top < wallRect.bottom
        ) {
            alert("ชนกำแพง!");
            return true; // ชนกำแพง
        }
    }
    return false; // ไม่ชน
}

//_________________ เริ่มเกม _______________________

// ตั้งค่าการวิ่งอัตโนมัติ
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startGame() {
    while(true) {
        moveRight();
        await delay(750);
    }
}

// ตัวอย่างที่ต้องพิมพ์
const textEl = document.querySelector("#text");
const targetText = "Typing games help improve your speed and accuracy daily.";
textEl.textContent = targetText;

// รับตัวอักษร
const displayEl = document.querySelector("#display");
let endGame = 0;

// ตรวจสอบว่าพิมพ์ถูกไหม
textEl.innerHTML = ""; // ล้างข้อความเก่า

// แยกตัวอักษรเป็น span
for (let i = 0; i < targetText.length; i++) {
    const span = document.createElement("span");
    span.textContent = targetText[i];
    textEl.appendChild(span);
}

const spans = textEl.querySelectorAll("span"); // เลือก span ทั้งหมดที่ส้ราง
let index = 0; // ตัวชี้ตำแหน่งตัวอักษร

document.addEventListener("keypress", function (event) {
    const char = event.key; // ตัวอักษรที่พิมพ์

    if (index < spans.length) {
        if (char === targetText[index]) {
            spans[index].classList.add("correct");
            moveLeft();
        } else {
            spans[index].classList.add("wrong");
        }
        index++;
    }

    if (endGame >= targetText.length) {
        alert("จบเกม!");
    }

});


