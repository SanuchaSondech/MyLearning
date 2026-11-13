let text1 = document.getElementsByTagName("p");
console.log(text1);

let text2 = document.getElementById("name1");
console.log(text2);

let num1 = 10;
let num2 = 20;

function displayName(){
    text2.innerHTML = "<p><strong>Sanucha Sondech</strong></p>"
}

function calcu(){
    textNum =document.getElementById("num");
    let sum = num1 + num2;
    textNum.innerHTML = `<p>num1 + num2 = ${sum} </p>`;
}


// มาตรฐานใหม่
const myIDEl = document.querySelector(".myID");
const name1El = document.querySelector("#name1");
const firstPEl = document.querySelectorAll("p");

console.log("querySelector");
console.log(myIDEl);
console.log(name1El);
console.log(firstPEl);

function changeStyName(){
    name1El.setAttribute("id", "sanuchaName");
}

const allTagh4 = document.querySelectorAll("h4");
console.log("allTagh4: ", allTagh4);

let message = allTagh4[0].innerHTML;
console.log("message: ", message);

const ulTagH4El = document.querySelector("#ulTagH4");
const h4El = document.querySelectorAll("h4");

console.log("h4[0]: ", h4El[0]);

let i = 0;

function addItem(){
    if (i >= h4El.length) return;

    const item = document.createElement("li");
    item.innerHTML= h4El[i].innerHTML;
    i++;
    ulTagH4El.appendChild(item);
}