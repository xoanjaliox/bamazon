USE bamazon_db;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("camera","electronics",499.99,20),
	   ("chips","food",3.99,200),
	   ("apples","food",1.00,350),
       ("jeans","clothing",69.79,50),
       ("sneakers","footwear",35.00,47),
       ("paint","crafts",5.00,25),
       ("detergent","cleaning",17.99,60),
       ("lotion","health and beuaty",15.00,32),
       ("shampoo","health and beauty",5.00,30),
       ("clue","games and toys",25.00,14);

INSERT INTO departments (department_name, overhead_costs)
VALUES ("electronics",10000),
	   ("food",15000),
       ("footwear",3500),
       ("cleaning",5000),
       ("health and beauty",7000),
       ("games and toys",4500),
       ("clothing",8000),
	   ("crafts",3000);
    
SELECT * FROM products;

SELECT * FROM departments;