/*for (var i = 0 ; i < document.querySelectorAll("button").length ; i++) {
 document.querySelectorAll("button")[i].addEventListener("click", function () {
    document.querySelector("h1").style.color = "purple";
   })
}*/

$("button").click(() => $("h1").css("color", "red"));

$("input").keypress((event) => $("h1").text(event.key));

$("h1").on("mouseover mouseleave", () => {
  $("h1").toggleClass("to-purple");
});

var numbers = [1, 2 , 3, 4];

var isEven = n => n%2 === 0;
var equare = n => n*n ;

numbers.forEach(number => console.log(number));

console.log(numbers.filter(isEven).map(equare));

let a = [1,2,3,4,5];

/*var sum = 0;

for (var i = 0 ; i < a.length ; i++) {

  sum = sum + a[i];
}*/

var sum = a.reduce((acc,current) => acc+current,0)

console.log(sum); // 15
