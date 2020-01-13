/*

To run this file, we do the following in our Terminal:

1. Go to the directory of this sql file.

2. Get into our mysql console.

3. Run "source schema.sql"

*/

-- Drops the bamazon_db if it already exists --
DROP DATABASE IF EXISTS bamazon_db;

-- Create the database movie_planner_db and specified it for use.
CREATE DATABASE bamazon_db;

USE bamazon_db;

-- Create the table plans.
CREATE TABLE products (
  item_id int NOT NULL AUTO_INCREMENT,
  product_name varchar(200) NOT NULL,
  department_name varchar(200) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL, 
  overhead_costs DECIMAL(10,2) NOT NULL DEFAULT 1000,
  PRIMARY KEY (department_id)
);

ALTER TABLE products ADD column product_sales decimal(10,2) NOT NULL default 0 AFTER price;
