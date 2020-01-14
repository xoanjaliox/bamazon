USE bamazon_db;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Headphones","Electronics",299.99,10),
	   ("V-neck T-Shirt","Clothing",9.99,50),
	   ("Cookies","Grocery",2.00,100),
       ("Shampoo","Beauty",4.99,50),
       ("Crayons","Arts and Crafts",3.99,50),
       ("Cards Against Humanity","Toys and Games",30.00,25),
       ("Dish Soap","Household Essentials",7.99,100),
       ("Pain Relief Medication","Health and Wellness",5.00,50),
       ("6-Pack Soda","Grocery",5.00,50),
       ("Basketball","Sporting Goods",10.00,50);

INSERT INTO departments (department_name, overhead_costs)
VALUES ("Electronics",20000),
	   ("Clothing",10000),
       ("Grocery", 8000),
       ("Beauty",5000),
       ("Arts and Crafts",3000),
       ("Toys and Games",5000),
       ("Household Essentials",10000),
	   ("Health and Wellness",5000),
       ("Sporting Goods",8000);
    
SELECT * FROM products;

SELECT * FROM departments;