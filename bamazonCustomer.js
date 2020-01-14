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
    port: 3306,

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

// R - read products
function readProducts(){
    console.log("Displaying all products...\n");
    connection.query("SELECT item_id, product_name, price FROM products",
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
            t.newRow();
        });
        //print table to screen
        console.log(t.toString());

        //call start()
        start()

    });
}

// U - update products
function updateProducts(product, userOrder){
    console.log("\nUpdating ", product[0].product_name, "...\n");
    //console.log(product);
    var sql = `UPDATE products 
               SET stock_quantity = ?, product_sales = ?
               WHERE item_id = ?`;
    var quant = product[0].stock_quantity - userOrder;
    //console.log(quant);
    var sales = product[0].price * userOrder;
    //console.log(sales);
   // console.log(product[0].item_id);
   var data = [quant, sales, product[0].item_id];
    connection.query(sql, data, function(err, res){
            if(err) throw err;
            console.log("\n"+res.affectedRows + " products updated!\n");
    });
    return true;
}

// order products as a customer
function orderProducts(allProducts){
    // get user input, check input against database, update database if necessary
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            choices: function(){
                var choiceArray = [];
                for (let index = 0; index < allProducts.length; index++) {
                    choiceArray.push(allProducts[index].product_name);
                }
                return choiceArray;
            },
            message: "Which product would you like to purchase?"
        },
        {
            type: "input",
            name: "quantityToPurchase",
            message: "How many of this item do you wish to purchase?"
        },
    ]).then(function(item){
        var userOrder = parseInt(item.quantityToPurchase);
        connection.query(
            "SELECT * FROM products WHERE ?",
            {   
                product_name: item.choice,
            },
            function(err, product){
                //console.log(product);
                if(err){ throw err;}
                else if (userOrder <= product[0].stock_quantity){
                    //update database
                    var bool = updateProducts(product, userOrder);

                    //console log total cost for customer
                    const totalCost = product[0].price * parseInt(item.quantityToPurchase);
                    //console.log("totalCost:", totalCost)
                    console.log("Your purchase of", product[0].product_name, "was successful. Your total cost is $"+totalCost);

                    if(bool) {
                        setTimeout(start, 1000);
                    }
                }
                else{
                    console.log("Insufficient Quantity")
                    start();
                }
            }
        );
    })
}

// ask customer what task to perform upon start of program
function start(){
    inquirer.prompt({
        name: "option",
        type: "list",
        message: "What would you like to do?",
        choices:["View Products for Sale", "Buy a Product for Sale", "EXIT"]
    }).then(function(answer){
        if(answer.option === "View Products for Sale"){
            readProducts();
        }else if(answer.option === "Buy a Product for Sale"){
            connection.query("SELECT item_id, product_name, price FROM products",
                function(err, res){
                    if (err) throw err;
                    orderProducts(res);
                });
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
    
    //start the program
    start();

});