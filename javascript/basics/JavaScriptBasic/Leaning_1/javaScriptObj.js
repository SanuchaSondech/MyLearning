let product = {
    name: "Notebook",
    price: 1500,
    color: "Blue",
    category: "Electronics",
    displayProduct: function(){
        return "name: " + this.name + ", price: " + this.price;
    },
    discount: function(){
        return this.price - (this.price * 10/100);
    },
    getName: function(){
        return this.name;
    }
};

document.body.innerHTML += "<p>Product name : " + product.name + "</p>";
document.body.innerHTML += "<p>Product get name : " + product.getName() + "</p>";
document.body.innerHTML += "<p>Product price : " + product.price + "</p>";
document.body.innerHTML += "<p>Product:"+product.displayProduct()+"</p>";
document.body.innerHTML += "<p>Product price after discount : " + product.discount() + "</p>";

/*  confirm */
document.body.innerHTML += "<p>______confirm______</p>";
function deleteData(){
    let result = confirm("คุณต้องการลบข้อมูลหรือไม่?");
    if (result){
        alert("ลบข้อมูลเรียบร้อย");
    } else{
        alert("ยกเลิกการลบข้อมูล");
    }
}


