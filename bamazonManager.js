//-------------------
// NPM PACKAGES
//-------------------
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');

//-------------------
// DATABASE SETUP
//-------------------
var connection = mysql.createConnection({
    host: 'localhost',
    
    //port
    port: 3307,

    //username
    user: "root",
    //password
    password:"root",

    //database
    database: "bamazon_db"
});

//-------------------
// FUNCTIONS
//-------------------
// C - create new products
function addProduct(){
    console.log("Let's add a new product...\n");
    connection.query("SELECT d.department_name FROM departments AS d", function(err, res){
        if (err) throw err;
        inquirer.prompt([
            {
                type:"input",
                name: "product_name",
                message: "What is the name of the product you're adding?"       
            },
            {
                
                type: "rawlist",
                name: "department_name",
                choices: function(){
                    var choiceArray = [];
                    for (let index = 0; index < res.length; index++) {
                        choiceArray.push(res[index].department_name);
                    }
                    return choiceArray;
                },
                message:"To which department does this new product belong?"
            },
            {
                type: "input",
                name: "price",
                message:"How much does this new product cost?"
            },
            {
                type: "input",
                name: "stock_quantity",
                message:"How much of this new product is in stock?"
            }
        ]).then(function(newProd){
            var sql = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?";
            var values=[
                [newProd.product_name, newProd.department_name, newProd.price, newProd.stock_quantity]
            ];
            connection.query(sql, [values],function(err, res){
                    if(err) throw err;
                    console.log("\n"+res.affectedRows + " products added!\n");
                    readProducts();
                }
            );
        });
    });
}

// R - read products
function readProducts(){
    console.log("Displaying all products...\n");
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products",
    function(err, res){
        if (err) throw err;
       // console.log(res);

        //create table to display all products
        var t = new Table;

        //add each product to table
        res.forEach(product => {
            t.cell("Item ID", product.item_id);
            t.cell("Product Name", product.product_name);
            t.cell("Price, USD", product.price, Table.number(2));
            t.cell("Quantity in Stock", product.stock_quantity);
            t.newRow();
        });
        //print table to screen
        console.log(t.toString());
        
        //call start()
        start()
    });
}

// R - View Low Inventory
function viewLowInventory(){
    console.log("Displaying all products with less than 5 items in stock...\n");
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products",
    function(err, res){
        if (err) throw err;
       // console.log(res);
       var lowStock = [];
       res.forEach(element => {
           if (element.stock_quantity <= 5){
               lowStock.push(element);
           }
       });

       if (lowStock.length === 0){
            console.log("No stock quantities under 5 items");
            //call start()
            start();
       } else{
            //create table to display all products
            var t2 = new Table;

            //add each product to table
            lowStock.forEach(product => {
                t2.cell("Item ID", product.item_id);
                t2.cell("Product Name", product.product_name);
                t2.cell("Price, USD", product.price, Table.number(2));
                t2.cell("Quantity in Stock", product.stock_quantity);
                t2.newRow();
            });
            //print table to screen
            console.log(t2.toString());

            //call start()
            start();
       }
    });
}

// U - update products
function updateInventory(){
    console.log("Let's update a product...\n");
    connection.query(
        "SELECT * FROM products", function(err, res){
        // update database based on user input
        inquirer.prompt([
            {
                type: "rawlist",
                name: "choice",
                choices: function(){
                    var choiceArray = [];
                    for (let index = 0; index < res.length; index++) {
                        choiceArray.push(res[index].product_name);
                    }
                    return choiceArray;
                },
                message: "Which product would you like to modify?"
            },
            {
                type: "input",
                name: "quantity",
                message: "Quantity to Add?"
            },
        ]).then(function(item){
            var stock = parseInt(item.quantity);
            connection.query(
                "SELECT * FROM products WHERE ?",
                [
                    {
                        product_name: item.choice,
                    }
                ], function(err, res){
                    if (err) throw err;
                    var currentStock = res[0].stock_quantity;
                    // console.log(res);
                    // console.log("currentStock", currentStock);
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity:stock+currentStock,
                            },
                            {   
                                product_name: item.choice,
                            },
                        ], function(err, res2){
                            if(err) throw err;
                            console.log("\n"+res2.affectedRows + " products updated!\n");
                            readProducts();
                        }
                    );
                }
            )
        });
    });
}
// D - delete products

// ask manager what task to perform upon start of program
function start(){
    inquirer.prompt({
        name: "option",
        type: "list",
        message: "What would you like to do?",
        choices:["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
    }).then(function(answer){
        if(answer.option === "View Products for Sale"){
            readProducts();
        }else if(answer.option === "View Low Inventory"){
            viewLowInventory();
        }else if(answer.option === "Add to Inventory"){
            updateInventory();
        }else if(answer.option === "Add New Product"){
            addProduct();
        }else if(answer.option === "EXIT"){
            connection.end();
        }
    });
}

//-------------------
// MAIN PROCESS
//-------------------
connection.connect(function(err){
    if (err) throw err;
    //a connection was made to database
    console.log("connected as id " + connection.threadId + "\n");
    
    //start
    start();
});