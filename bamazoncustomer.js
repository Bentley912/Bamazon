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
};

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
      connection.query("SELECT * FROM products WHERE ?", {id:purchaseId}, function(err,res){  
        for(var i = 0; i <res.length; i++){
            console.log(res[i].id + " " + res[i].product_name + " | Department: " + res[i].department_name + " | Price: " + res[i].price + " | In Stock: " + res[i].stock_quantity );
            var price = purchaseQuantity * res[i].price;
            if (purchaseQuantity > res[i].stock_quantity){
              console.log("We do not have enough of this Item in Stock to Fulfill Your Request");
            }
            else{
              console.log ("Your Purchase Price is "+ price);
              var stockUpdate = res[i].stock_quantity - purchaseQuantity;     
            }
            connection.query("UPDATE products SET stock_quantity=? WHERE  id =?", [stockUpdate, purchaseId], function(err,res){
                  console.log('Your purchase has been processed. Thank You for Your Business');
              })
        }       
      });  
  });
}

begin();
purchase();
