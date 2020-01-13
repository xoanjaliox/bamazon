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
// C - create new department
function addDepartment(){
    console.log("Let's add a new department...\n");
    inquirer.prompt([
        {
            type:"input",
            name: "department_name",
            message: "What is the name of the department you're adding?"       
        }
    ]).then(function(newDept){
        var stmt = `INSERT INTO departments (department_name) VALUES (?)`;
        var val = newDept.department_name;
        connection.query(stmt, [val],function(err, res){
                if(err) throw err;
                console.log("\n"+res.affectedRows + " department added!\n");
                
                //call start()
                start();
            }
        );
    });
}

// R - View Product Sales by Department
function viewProductSales(){
    console.log("Displaying all sales by department...\n");
    connection.query(`SELECT d.department_id, d.department_name, d.over_head_costs, SUM(p.product_sales) AS product_sales, (SUM(p.product_sales)-d.over_head_costs) AS total_profit
    FROM departments AS d 
    LEFT JOIN products AS p ON d.department_name=p.department_name
    GROUP BY d.department_id`,
    function(err, res){
        if (err) throw err;
        //console.log(res);

        //create table to display all products
        var t = new Table;

        //add each item to table
        res.forEach(item => {
            t.cell("Department ID", item.department_id);
            t.cell("Department Name", item.department_name);
            t.cell("Over Head Costs", item.over_head_costs, Table.number(2));
            t.cell("Product Sales", item.product_sales, Table.number(2));
            t.cell("Total Profit", item.total_profit, Table.number(2));
            t.newRow();
        });
        //print table to screen
        console.log(t.toString());
        
        //call start()
        start();
    });
}

// ask Supervisor what task to perform upon start of program
function start(){
    inquirer.prompt({
        name: "option",
        type: "list",
        message: "What would you like to do?",
        choices:["View Product Sales by Department", "Create New Department", "EXIT"]
    }).then(function(answer){
        if(answer.option === "View Product Sales by Department"){
            viewProductSales();
        }else if(answer.option === "Create New Department"){
            addDepartment();
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