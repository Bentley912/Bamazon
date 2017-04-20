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
           var newQuantity;
           var addId;
           var addQuantity;

           var Quantity;
           inquirer.prompt([/* Pass your questions in here */
                {
                  type:'input',
                  name:'id',
                  message:'Please enter id of Item you wish to Add:'
                },
                {
                 type:'input',
                  name:'quantity',
                  message:'Please enter the quantity you would like to Update:'   
                }

           
           ]).then(function (answers) {
                addId = parseInt(answers.id);
                addQuantity = parseInt(answers.quantity);
                connection.query("SELECT * FROM products WHERE ?", {id:addId}, function(err,res){ 
                    for(var i=0; i<res.length; i++){
                        console.log(res[i].id + " " + res[i].product_name + " | Department: " + res[i].department_name + " | Price: " + res[i].price + " | In Stock: " + res[i].stock_quantity );     
                        newQuantity = res[i].stock_quantity + addQuantity;
                        console.log(newQuantity);
                        connection.query("UPDATE products SET stock_quantity=? WHERE  id =?", [newQuantity, addId], function(err,res){
                        console.log('Your purchase has been processed. Thank You for Your Business');
                         })
                    }                    
                })               
            });
       }   

       else if (answers.choice === 'Add New Products'){
            inquirer.prompt([
                {
                  type:'input',
                  name:'name',
                  message:'Please enter Name of Item you wish to Add: '
                },
                {
                    type:'input',
                    name:'department',
                    message: 'Please Enter the Department Name of the Item You are adding(e.g. Electronics): '
                },
                {
                    type:'input',
                    name: 'price',
                    message: 'Please Enter the Price of the Item: '
                },
                {
                    type:'input',
                    name: 'quantity',
                    message: 'Please enter the Quantity to be Added to the Inventory: '
                }
            ]).then(function (answers) {
               console.log(answers.name);
               console.log(answers.department);
               console.log(answers.price);
               console.log(answers.quantity);
               connection.query("INSERT INTO products SET ?", {product_name:answers.name, department_name:answers.department, price:parseInt(answers.price), stock_quantity:parseInt(answers.quantity)}, function(err, res) {
                   if (err)throw err;
                   console.log("Prouct Added. ")
               });

            });
       }

    });

}

managerBegin();