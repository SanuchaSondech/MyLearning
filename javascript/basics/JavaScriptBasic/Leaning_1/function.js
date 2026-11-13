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

// ____________________________________________-

function Hello(){
    document.body.innerHTML += "<h2>Hello JavaScript Functions</h1>";
}
Hello();

function alertMessage(){
    alert("This is an alert message!");
}

function displayName(){
    document.body.innerHTML += "<h2>Sanucha</h2>";
}

// parameters and arguments

function add(num1, num2){
    let sum = num1 + num2;
    document.body.innerHTML += "<p>Sum : " + sum + "</p>";
}
add(1, 2)

// Return functions
function myIP(){
    return "127.0.0.1";
}

let ip = myIP();
document.body.innerHTML += "<p>My IP : " + ip + "</p>";

// parameters and Return
function isPassed(score){
    return (score >= 50)? "Passed" : "Failed";
}

let result = isPassed(75);
document.body.innerHTML += "<p>Result : " + result + "</p>";

// function กำหนดเริ่มต้น
function showInfo(name, age = 0){
	document.body.innerHTML += "<p>name : " + name + ", age : " + age + "</p>";
}

showInfo("Sanucha", 22);
showInfo("Anucha");

// _____________Scope_____________
document.body.innerHTML += "<p>________Value Scope________</p>";

let val = 10;
document.body.innerHTML += "<p>Global val : " + val + "</p>";

function localScope(){
	let val = 20;
	document.body.innerHTML += "<p>Local val : " + val + "</p>";
}

localScope();

document.body.innerHTML += "<p>Global val : " + val + "</p>";

// _____________Control Structures_____________
document.body.innerHTML += "<p>________Array________</p>";

let colors = ["Red", "Green", "Blue", "Yellow"];
let fruits = ["Apple", "Banana", "Mango", "Orange"];
let count = colors.length;

document.body.innerHTML += "<p>Array colors : " + colors + "</p>";
document.body.innerHTML += "<p>colors count : " + count + "</p>";

colors.sort();
document.body.innerHTML += "<p>colors sort : " + colors + "</p>";

document.body.innerHTML += "<p>Array fruits : " + fruits + "</p>";

fruits.reverse();
document.body.innerHTML += "<p>fruits reverse : " + fruits + "</p>";

// first and last
document.body.innerHTML += "<p>fruits first : " + fruits[0] + "</p>";
document.body.innerHTML += "<p>fruits last : " + fruits[fruits.length - 1] + "</p>";

// push and pop
fruits.push("Pineapple");
document.body.innerHTML += "<p>fruits push : " + fruits + "</p>";

fruits.pop();
document.body.innerHTML += "<p>fruits pop : " + fruits + "</p>";

// for loop
let index = 0;
// for (let i = 0; i < colors.length; i++)
for (let color of colors) {
	document.body.innerHTML += "<p>" + index + " color : " + color + "</p>";
	index++;
}

document.body.innerHTML += "<p> for each color : </p>";

colors.forEach(color => {
	document.body.innerHTML += "<p> color : " + color + "</p>";
});

/*colors.forEach(getMyData);

function getMyData(color) {
	document.body.innerHTML += "<p> color : " + color + "</p>";
}*/

/* Array to String */
document.body.innerHTML += "<p>Array to String : </p>";
let animals = ["Dog", "Cat", "Elephant", "Tiger"];
document.body.innerHTML += "<p>animals array : " + animals + "</p>";
document.body.innerHTML += "<p>Array count : " + animals.length + "</p>";
document.body.innerHTML += "<p>animals array type : " + typeof(animals) + "</p>";
/* .toString() */
let animalStr = animals.toString();
document.body.innerHTML += "<p>animals to String : " + animalStr + "</p>";
document.body.innerHTML += "<p>animalStr type : " + typeof(animalStr) + "</p>";

/* .join() */
let animalJoin = animals.join(" ");
document.body.innerHTML += "<p>animals join : " + animalJoin + "</p>";
document.body.innerHTML += "<p>animalJoin type : " + typeof(animalJoin) + "</p>";

/* pop */
document.body.innerHTML += "<p>animals array : " + animals + "</p>";
animals.pop();
let animalsPop = animals.pop();
document.body.innerHTML += "<p>animals array : " + animals + "</p>";

/* concat a.concat(b, c); */

let vegetables = ["Cabbage", "Cauliflower", "Broccoli"];
let  firsts = ["Apple", "Banana", "Mango"];

document.body.innerHTML += "<p>Array vegetables : " + vegetables + "</p>";
document.body.innerHTML += "<p>Array firsts : " + firsts + "</p>";

let allFoods = vegetables.concat(firsts);

document.body.innerHTML += "<p>All foods : " + allFoods + "</p>";

/* เรียงเลข */
document.body.innerHTML += "<p> _______เรียงตัวเลข_______ </p>";

let num1 = [40, 100, 1, 5, 25, 10, -8];
document.body.innerHTML += "<p>num1 array : " + num1 + "</p>";

num1.sort(function(a, b){
	return a-b;
});

document.body.innerHTML += "<p>num1 sorted array : " + num1 + "</p>";