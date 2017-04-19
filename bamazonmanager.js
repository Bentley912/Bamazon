var mysql = require("mysql");
var prompt = require("prompt");
var inquirer = require('inquirer');


var connection = mysql.createConnection({
    host: "localhost",
    port:"3306",
    user: "root",
    password:"root",
    database: "bamazon" 
});

connection.connect(function(err){
    if (err) throw err;
    console.log("connencted as id " + connection.threadId);
});

function managerBegin(){
  
    inquirer.prompt([
        {
    type: 'list',
    name: 'choice',
    message: 'What do you want to do?',
    choices: [
      'See all Products',
      'View Low Inventory',
      'Add to Inventory',
      'Add New Products'
    ]
  },
    
    ]).then(function (answers) {
        // Use user feedback for... whatever!! 
       if (answers.choice === 'See all Products'){
           console.log("\nYou Chose " + answers.choice + "\n");
           connection.query("SELECT * FROM products", function(err,res){
            console.log("\nHere is our current Stock: \n");
            for(var i = 0; i <res.length; i++){
                console.log(res[i].id + " " + res[i].product_name + " | Department: " + res[i].department_name + " | Price: " + res[i].price + " | In Stock: " + res[i].stock_quantity );
            }   
         });  
       }    
       else if (answers.choice === 'View Low Inventory'){
           console.log("\nYou Chose " + answers.choice + "\n");
           connection.query("SELECT * FROM products WHERE stock_quantity < ?",[5], function(err,res){
            console.log("\n Here is our low stock: \n");
                for(var i = 0; i <res.length; i++){
                console.log(res[i].id + " " + res[i].product_name + " | Department: " + res[i].department_name + " | Price: " + res[i].price + " | In Stock: " + res[i].stock_quantity );
                }   
            });
       } 

       else if (answers.choice === 'Add to Inventory'){
           inquirer.prompt([/* Pass your questions in here */
                {
                  type:'input',
                  name:'id',
                  message:'Please enter id of Item you wish to Add:'
                },
                {
                 type:'input',
                  name:'quantity',
                  message:'Please enter the quantity you would like to add:'   
                }

           
           ]).then(function (answers) {
                var addId = parseInt(answers.id);
                var addQuantity = parseInt(answers.quantity);
                connection.query("UPDATE products SET stock_quantity + ? WHERE  id =?", [addQuantity, addId], function(err,res){
                    console.log('Your purchase has been processed. Thank You for Your Business');
                    for (var i = 0; i < res.length; i++){
                        console.log(res[i].id + " " + res[i].product_name + " | Department: " + res[i].department_name + " | Price: " + res[i].price + " | In Stock: " + res[i].stock_quantity );
                    }
                })
            });
       }          
        
    });

}

managerBegin();