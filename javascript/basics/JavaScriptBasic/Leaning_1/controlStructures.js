(function () {
	const origLog = console.log;
	console.log = (...args) => {
		const text = args.map(a => {
			try {
				return (typeof a === 'object') ? JSON.stringify(a) : String(a);
			} catch (e) {
				return String(a);
			}
		}).join(' ');
		document.body.innerHTML += '<pre>' + text + '</pre>';
		// still log to the browser console
		origLog.apply(console, args);
	};
})();

console.log("______if-else______");
let score = 75;
console.log("score : ", score);
if (score >= 60) {
	console.log("You passed!");
} else if (score >= 50) {
	console.log("You failed.");
} else {
    console.log("You need to retake the exam.");
}

let ispassed = (score >= 60)? "You passed!" : "You failed.";
console.log(ispassed);

// เลขคู่ คี่
let number = 4;
console.log("number : ", number);
let evenOdd = (number % 2 === 0)? "Even" : "Odd";
console.log("number is ", evenOdd);

console.log("______switch-case______");
let day = 3;
console.log("day : ", day);
switch (day) {
    case 1:
        console.log("Monday");
        break;
    case 2:
        console.log("Tuesday");
        break;
    case 3:
        console.log("Wednesday");
        break;
    default:
        console.log("Invalid day");
}

console.log("______While Loop______");
// ไม่รู้จำนวนรอบที่แน่นอน

let count = 1;
while (count <= 5) {
    if (count == 3) {
        console.log("break count : ", count);
        break;
    }
    console.log("count : ", count);
    count++;
}

console.log("______For Loop______");
// รู้จำนวนรอบที่แน่นอน

for (let i = 1; i <= 5; i++) {
    if(i==3){
        console.log("continue i : ", i);
        continue;
    }
    console.log("i : ", i);
}

console.log("______null undefined NaN______");
let a = null;
let b; // undefined
let c = 10+"abc"; // NaN

console.log("a : ", a, typeof(a));
console.log("b : ", b, typeof(b));
console.log("c : ", c, typeof(c));

if(!a){
    console.log("a is null");
}
if(!b){
    console.log("b is undefined");
}