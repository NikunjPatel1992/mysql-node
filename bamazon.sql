DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products
(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(100) NULL,
    price INT(10) NULL,
    stock_quantity int(10) NULL,
    PRIMARY KEY(item_id)
);

CREATE TABLE departments
(
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NULL,
    over_head_costs INT(10) NULL,
    PRIMARY KEY(department_id)
);



ALTER TABLE products
ADD COLUMN product_sales INT(10) NULL AFTER stock_quantity;


DROP TABLE departments;


DELETE FROM departments WHERE department_id = "1";

INSERT INTO products VALUES (1, "chair", "furniture", 45, 10),
(2,"tabel", "furniture", 70, 3),
(3,"computer", "electronic", 200, 30),
(4,"laptop", "electronic", 500, 50),
(5,"Desk", "furniture", 350, 45),
(6,"fan", "electronic", 150, 4),
(7,"microwave oven", "electronic", 275, 24);

INSERT INTO products VALUES (5, "printer", "furniture", 45, 3),
(6,"scannar", "furniture", 70, 4);


SELECT 
    department_name, 
    COUNT(department_name)
FROM
    bamazon.products
GROUP BY department_name
HAVING COUNT(department_name) > 1;

SELECT department_name, 
sum(product_sales) as cost FROM 
Bamazon.products GROUP BY department_name;

SELECT department_name, 
sum(over_head_costs) as over_head_costs, sum(product_sales) as cost FROM 
Bamazon.departments GROUP BY department_name;