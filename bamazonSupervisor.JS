var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "Nikunj@145",
    database: "bamazon"
})

connection.connect(function (err) {
    if (err) throw err;
    Start();
});

function Start() {
    inquirer
        .prompt([
            {
                name: "select",
                type: "rawlist",
                message: "Select option?",
                choices:
                    [
                        "View Product Sales by Department",
                        "Create New Department",
                        "Exit"
                    ]
            }
        ])
        .then(function (answer) {
            if (answer.select === "View Product Sales by Department") {
                viewProductsSaleDepartment();
            }
            else if (answer.select === "Create New Department") {
                createNewDepartment();
            }
            else if (answer.select === "Exit") {
                connection.end();
            }
        });
}

//===============View Product Sales by Department============
function viewProductsSaleDepartment() {
    console.log("======================")
    console.log(chalk.green("View Product Sales by Department"));

    connection.query("DROP TABLE bamazon.departments", function (err, results) {
        if (err) throw err;
    });

    connection.query("CREATE TABLE departments (department_id INT NOT NULL AUTO_INCREMENT, department_name VARCHAR(100) NULL, over_head_costs INT(10) NULL,product_sales INT(10) NULL, PRIMARY KEY(department_id));",
        function (err, results) {
            if (err) throw err;
        });

    connection.query("SELECT * FROM products", function (err, results) {

        for (var i = 0; i < results.length; i++) {

            var sale_quantity = results[i].product_sales / results[i].price;
            // console.log(`[${i}] || ${sale_quantity}`);
            var profit = results[i].product_sales * 0.20;
            var overheadcosts = results[i].product_sales - profit;
            // console.log(`[${i}] || ${profit}`);

            connection.query("INSERT INTO departments SET ?",
                {
                    department_name: results[i].department_name,
                    over_head_costs: overheadcosts,
                    product_sales: results[i].product_sales
                },
                function (err, res) {
                    if (err) throw err;
                    // console.log(res.affectedRows + " product inserted!\n");

                }
            );
        }
        connection.query("SELECT department_name, sum(over_head_costs) as over_head_costs, sum(product_sales) as product_sales FROM Bamazon.departments GROUP BY department_name;",
            function (err, results) {
                if (err) throw err;

                var values = [];
                for (var i = 0; i < results.length; i++) {
                    var totalprofit = results[i].product_sales - results[i].over_head_costs;
                    // console.log(totalprofit);
                    values.push([i + 1, results[i].department_name, results[i].over_head_costs, results[i].product_sales, totalprofit]);
                    // console.log([i+1]+"\t"+results[i].department_name + "\t" + results[i].over_head_costs + "\t" + results[i].product_sales + "\t" + totalprofit);
                }
                // console.log(values);
                console.log("\n-------------------------------------------------------------------------");
                console.table(['ID', 'Department Name', 'Over Head Costs', 'Product Sales', 'Profit'], values);

                Start();
            });

        console.log("===================");
        // Start();
    });

}
//=================End===============================

//================Create New Department===========================
function createNewDepartment() {
    console.log("======================");
    console.log(chalk.green("Create New Department"));

    inquirer
        .prompt([
            {
                name: "departmentname",
                type: "input",
                message: "Type Department Name?"
            },
            {
                name: "overheadcosts",
                type: "input",
                message: "Type Over Head Costs?"
            }
        ])
        .then(function (answer) {
            connection.query("INSERT INTO departments SET ?",
                {
                    department_name: answer.departmentname,
                    over_head_costs: answer.overheadcosts
                },
                function (err, results) {
                    if (err) throw err;
                    console.log("====================");
                    console.log(chalk.green("Add the Record successfully!"));
                    console.log("====================");
                    Start();
                }
            );
        });

    // console.log("======================");
    // Start();
}
//=================End===============================