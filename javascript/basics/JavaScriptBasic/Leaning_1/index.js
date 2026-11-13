document.body.innerHTML += "<h1>Hello JavaScript!</h1>";
document.body.innerHTML += "<p>This is a simple JavaScript application.</p>";

// Redirect console.log output to the page so existing console.log(...) lines
// will also appear in the document. This keeps the original console output
// while appending a readable version to the page for learning/demo purposes.

// alert("Welcome to the JavaScript Basics!")

/*
console.log("JavaScript is running.");
console.error("This is an error message.");
console.warn("This is a warning message.");
*/

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

// _____________Variables_____________

// Variable
let name0;
console.log(name0);

let name1 = "Sanucha";
console.log(name1);

let num = 42;
console.log("Num : ",num);

num = num + 8;
console.log("Num + 8 : ",num);

num = "Now I'm a string";
console.log("Num : ",num);

// const
const pi = 3.14;
console.log("Pi : ",pi);
console.log(typeof(pi));
// pi = 3.14 + 2 ; // error

console.log("_______Data types_______");

// number
let int1 = 10;
let float1 = 9.99;
console.log("Int1 : ",int1,", Float1 : ",float1);
console.log(typeof(int1), typeof(float1));

// string
let str1 = "Hello";
let str2 = 'World';
console.log("Str1 : ",str1,", Str2 : ",str2);
console.log(typeof(str1), typeof(str2));

// boolean
let bool1 = true;
let bool2 = true;
bool2 = false;
console.log("Bool1 : ",bool1,", Bool2 : ",bool2);
console.log(typeof(bool1), typeof(bool2));

console.log("_______Type Conversion_______");
let val1 = "99.99";
let val2 = "99.99";
console.log("val1 : ", val1, ", val2 : ", val2);

val1 = parseInt(val1); // ตัดเศษออก
//val2 = parseFloat(val2);
val2 = +val2;
console.log("val1 : ", val1, ", val2 : ", val2);

let val3 = 10.1;
val3 = val3+""; // .toString()
console.log("val3 : ", val3, typeof(val3));

console.log("_______Array_______");
let fruits = ["Apple", "Banana", "Cherry", 11];
console.log("Fruits : ", fruits);
console.log("Fruits[0] : ", fruits[0]);
console.log(typeof(fruits));

let numbers = new Array(1, 2, 3, 4, 5);

console.log("Numbers : ", numbers);
console.log("numbers[0] + numbers[4] :",numbers[0] + numbers[4]);

console.log("_______Operators_______");
let a = 10;
let b = 3;
console.log("a :", a, ", b :", b);
let sum = a + b;
console.log("Sum :", sum);
let difference = a - b;
console.log("Difference :", difference);
let product = a * b;
console.log("Product :", product);
let quotient = a / b;
console.log("Quotient :", quotient);
let remainder = a % b;
console.log("Remainder :", remainder);
let power = a ** b;
console.log("Power :", power);

// boolean operators
console.log("_______Boolean Operators_______");
console.log("a :", a, ", b :", b);
console.log("a > b :", a > b);
console.log("a < b :", a < b);
console.log("a >= b :", a >= b);
console.log("a <= b :", a <= b);
console.log("a == b :", a == b);
console.log("a != b :", a != b);
let t = true;
let f = false;
console.log("t :", t, ", f :", f);
console.log("t && f :", t && f);
console.log("t || f :", t || f);
console.log("!t :", !t);