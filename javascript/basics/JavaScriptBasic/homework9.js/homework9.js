const numbers = [5, 10, 15, 20, 25];

document.body.innerHTML += "<h3>กำหนดให้ const numbers = [5, 10, 15, 20, 25];</h3>";
// ข้อ a
document.body.innerHTML += "<p>a.Use the map() method to create a new array where each number is squared.</p>";

const squaredNumbers = numbers.map(function(num){
    return num * num;
});

document.body.innerHTML += "<p>Squared Numbers: [ " + squaredNumbers.join(", ") + " ]</p>";

// ข้อ b
document.body.innerHTML += "<p>b.Use the filter() method to create a new array containing only even numbers.</p>";

const evenNumbers = numbers.filter(function(num){
    return num % 2 === 0;
});

document.body.innerHTML += "<p>Even Numbers: [ " + evenNumbers.join(", ") + " ]</p>";

// ข้อ c

document.body.innerHTML += "<p>c.Use the reduce() method to calculate the sum of all numbers in the array.</p>";

const sumNumber = numbers.reduce(function(sum, num){
    return sum + num;
}, 0);

document.body.innerHTML += "<p>Sum of Numbers: " + sumNumber + "</p>";

document.body.innerHTML += "<p>___________________________________________</p>";

document.body.innerHTML += "<h3>กำหนด const students = [<br>\
  { id: 1, name: 'Alice', grade: 85 },<br>\
  { id: 2, name: 'Bob', grade: 75 },<br>\
  { id: 3, name: 'Charlie', grade: 95 },<br>\
  { id: 4, name: 'David', grade: 60 }<br>\
] </h3>";

const students = [
  { id: 1, name: 'Alice', grade: 85 },
  { id: 2, name: 'Bob', grade: 75 },
  { id: 3, name: 'Charlie', grade: 95 },
  { id: 4, name: 'David', grade: 60 }
];

// ข้อ a
document.body.innerHTML += "<p>a. Use the map() method to create an array of student names. </p>";

const studentNames = students.map(function(student){
    return "neme : " + student.name;
});
document.body.innerHTML += "<p>Student Names = [<br> " + studentNames.join(",<br> ") + " <br>]</p>";

// ข้อ b
document.body.innerHTML += "<p>b. Use the filter() method to create a new array containing only students who passed (grade >= 70). </p>";
const passedStudents = students.filter(function(student){
    return student.grade >= 70;
});

document.body.innerHTML += "<p>Passed Students = [<br> " + passedStudents.map(s => "{ id: " + s.id + ", name: '" + s.name + "', grade: " + s.grade + " }").join(",<br> ") + " <br>]</p>";

// ข้อ c
document.body.innerHTML += "<p>c. Use the reduce() method to calculate the average grade of all students.</p>";

const avgGrade = (students.reduce(function(sum, student){
    return sum + student.grade;
}, 0)) / students.length;

document.body.innerHTML += "<p>Average Grade : " + avgGrade + "</p>";

document.body.innerHTML += "<p>___________________________________________</p>";

document.body.innerHTML += "<h3>const products = [<br>\
  { id: 1, name: 'Laptop', price: 800 },<br>\
  { id: 2, name: 'Mouse', price: 20 },<br>\
  { id: 3, name: 'Keyboard', price: 50 },<br>\
  { id: 4, name: 'Monitor', price: 150 }<br>\
]</h3>";

document.body.innerHTML += "<p>ใช้คำสั่ง map filter reduce ในการทิ้งสินค้าที่ราคาน้อยกว่า 100 จากนั้นให้เพิ่มมูลค่าสินค้าเป็น 2 เท่าของข้อมูลที่มีอยู่ จากนั้นทำการหามูลค่าสินค้าที่เหลือทั้งหมด (อยู่ในคำสั่งเดียว)</p>";

const products = [
  { id: 1, name: 'Laptop', price: 800 },
  { id: 2, name: 'Mouse', price: 20 },
  { id: 3, name: 'Keyboard', price: 50 },
  { id: 4, name: 'Monitor', price: 150 }
];

const totalValue = products.filter(function(product){
  return product.price >= 100;
}).map(function(product){
  return { id: product.id, name: product.name, price: product.price * 2 };
}).reduce(function(sum, product){
  return sum + product.price;
}, 0);

document.body.innerHTML += "<p>Total Value of Products : " + totalValue + "</p>";