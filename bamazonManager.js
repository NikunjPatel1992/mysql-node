var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require('chalk');
const ctable = require('console.table');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Nikunj@145",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    inquirer
        .prompt({
            name: "select",
            type: "rawlist",
            message: "Select option from products?",
            choices:
                [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product",
                    "Exit"
                ]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.select === "View Products for Sale") {
                viewProductsSale();
            }
            else if (answer.select === "View Low Inventory") {
                lowInventory();
            }
            else if (answer.select === "Add to Inventory") {
                addInventory();
            }
            else if (answer.select === "Add New Product") {
                addNewProducts();
            }
            else {
                connection.end();
            }
        });
}

function viewProductsSale() {
    console.log("======================")
    console.log(chalk.green("View Products For Sale"));
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        var values = [];
        for (var i = 0; i < results.length; i++) {
            values.push([results[i].item_id, results[i].product_name,  results[i].price, results[i].stock_quantity])
            // console.log(chalk.blue(`${results[i].item_id} || ${results[i].product_name} || Price :${results[i].price} || Quantities :${results[i].stock_quantity}`));
        }
        console.log('---------------------------------------')
        console.table(['ID', 'Product Name', 'Price', 'Stock Quantity'], values);
        console.log("======================");
        start();
    })

}

function lowInventory() {
    console.log("======================")
    console.log(chalk.green("View Low Inventory"));
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        var values = [];
        for (var i = 0; i < results.length; i++) {
            if (results[i].stock_quantity <= 5) {
                values.push([results[i].item_id, results[i].product_name,  results[i].price, results[i].stock_quantity])
                // console.log(chalk.blue(`${results[i].item_id} || ${results[i].product_name} || Price :${results[i].price} || Quantities :${results[i].stock_quantity}`));

            }
        }
        console.log('---------------------------------------')
        console.table(['ID', 'Product Name', 'Price', 'Stock Quantity'], values);
        console.log("======================")
        start();
    });
}

function addInventory() {
    console.log("======================")
    console.log(chalk.green("Add To Inventory"));
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        var values =[];
        for (var i = 0; i < results.length; i++) {
            values.push([results[i].item_id, results[i].product_name,  results[i].price, results[i].stock_quantity])
            // console.log(chalk.blue(`${results[i].item_id} || ${results[i].product_name} || Price :${results[i].price} || Quantities :${results[i].stock_quantity}`));
        }
        console.log('---------------------------------------')
        console.table(['ID', 'Product Name', 'Price', 'Stock Quantity'], values);
        addin();
    })
}

function addin() {
    inquirer
        .prompt([{
            name: "userid",
            type: "input",
            message: "Type ID of the product you would like to Add Quantities?"
        },
        {
            name: "units",
            type: "input",
            message: "how many units of the product they would like to Add."
        }])
        .then(function (answer) {

            connection.query("SELECT * FROM products", function (err, results) {
                if (err) throw err;
                // console.log(answer.userid);
                // console.log(answer.units);
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_id == answer.userid) {
                        var chosenItem;
                        chosenItem = results[i];
                        // console.log("Match");
                    } else if (results[i].item_id != answer.userid) {
                        // console.log("Not Match");
                    }
                }

                if (chosenItem.stock_quantity != "" || parseInt(answer.units != "")) {

                    var total_quantity = (parseInt(chosenItem.stock_quantity) + parseInt(answer.units));
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: total_quantity
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            // usertotal();
                            console.log("====================");
                            console.log(chalk.green("Inventory Add successfully!"));
                            console.log("====================");
                            start();
                        }
                    );
                }
                else {
                    // quantity wasn't match enough, so apologize and start over
                    console.log("====================");
                    // console.log(chalk.yello("Try again..."));
                    console.log("====================");
                    start();
                }
            })
        });
}

function addNewProducts() {
    console.log("======================")
    console.log(chalk.green("Add New products"));
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "Input Id"
            },
            {
                name: "name",
                type: "input",
                message: "Type Products Name?"
            },
            {
                name: "departmentname",
                type: "input",
                message: "Type Department Name?"
            },
            {
                name: "price",
                type: "input",
                message: "Input Price?"
            },
            {
                name: "quantity",
                type: "input",
                message: "Type Quantity?"
            }
        ])
        .then(function (answer) {

            // if (answer.id != " " || answer.name != " " || answer.departmentname != " " || answer.price != " " || answer.stock_quantity != " ") {
            //     console.log("Add Try again...");
            // } else {
            //     console.log("====================");
            //     console.log("Try again...");
            //     console.log("====================");
            //     // start();
            // }

            connection.query(
                "INSERT INTO products SET ? ",
                {
                    item_id: answer.id,
                    product_name: answer.name,
                    department_name: answer.departmentname,
                    price: answer.price,
                    stock_quantity: answer.quantity
                },                
                function (error) {
                    if (error) throw err;
                    // usertotal();
                    console.log("====================");
                    console.log(chalk.green("Add the Record successfully!"));
                    console.log("====================");
                    start();
                }
            )
        });


}
