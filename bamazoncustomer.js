var mysql = require("mysql");
var prompt = require("prompt");

var connection = mysql.createConnection({
    host: "localhost",
    port:"3306",
    user: "root",
    password:"root",
    database: "bamazon" 
});

var purchaseId;
var purchaseQuantity;

// connection.connect(function(err){
//     if (err) throw err;
//     console.log("connencted as id " + connection.threadId);
// });

function begin(){
  connection.query("SELECT * FROM products", function(err,res){
      console.log("\nHere is our current Stock: \n");
      for(var i = 0; i <res.length; i++){
          console.log(res[i].id + " " + res[i].product_name + " | Department: " + res[i].department_name + " | Price: " + res[i].price + " | In Stock: " + res[i].stock_quantity );
      }   
     
  });
}

function purchaseQuery(){
  
}


function purchase(){
    var schema = {
    properties: {
      item: {  
        message: 'Please Enter the ID# of the Item ou wish to purchase: ',
        required: true,   
      },
      quantity: {     
        message:'Please enter the Number of this Item you would like to Purchase: '
      }
    }
  };
    prompt.get(schema, function (err, result) {
      purchaseId = parseInt(result.item);
      purchaseQuantity = parseInt(result.quantity);
      console.log(purchaseId);
      console.log(purchaseQuantity);
      console.log("Here is the purchase id: " + purchaseId);
      connection.query("SELECT * FROM products WHERE ?", {id:purchaseId}, function(err,res){  
      console.log(res);  

      if (purchaseQuantity > res.stock_quantity){
        console.log("Sorry, we do not have enough stock currently to fulfill your request")
      }
      else{
        connection.query("UPDATE products SET stock_quantity = stock_quantity - ?  WHERE id = ?", [
          purchaseQuantity,purchaseId
        ], function(err, res) {
          if (err) throw err;
          var price = purchaseQuantity * res.price;
          console.log(price);
        });
      }

  })
    });
    
}

begin();
purchase();
