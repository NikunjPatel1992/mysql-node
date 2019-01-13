var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require('chalk');
const ctable = require('console.table')

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
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;        
        
        var values = [];
        for (var i = 0; i < results.length; i++) {
            values.push([results[i].item_id, results[i].product_name, results[i].price, results[i].stock_quantity]);
            // console.log(chalk.blue(`${results[i].item_id} \t ${results[i].product_name} \t ${results[i].price}`));
        }
        console.log("----------------------------------------");
        // console.log(values);
        console.table(['ID', 'Product Name', 'Price','Stock Quantity'], values);
        user();
    })
}

function user() {
    inquirer
        .prompt([{
            name: "userid",
            type: "input",
            message: "Type ID of the product you would like to buy?"
        },
        {
            name: "units",
            type: "input",
            message: "how many units of the product they would like to buy."
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

                if (chosenItem.stock_quantity >= parseInt(answer.units)) {
                    // quantity was match enough, so update db, let the user know, and start over
                    var total_quantity = chosenItem.stock_quantity - answer.units;
                    var total = chosenItem.price * answer.units;
                    // console.log(total_quantity);
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
                            console.log(chalk.green("placed the order successfully!"));
                            console.log(chalk.green("your total cost: " + total));
                            console.log("====================");
                            start();
                        }
                    );

                    var prod_sales = parseInt(chosenItem.product_sales) + parseInt(total);
                    // console.log(chosenItem.product_sales);
                    var produc = chosenItem.product_sales
                    // console.log(prod_sales);
                    if (produc === null) {
                        console.log("this is nan");
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    product_sales: total
                                },
                                {
                                    item_id: chosenItem.item_id
                                }
                            ],
                            function (err) {
                                if (err) throw err;
                                console.log("====================");
                                console.log(chalk.green("order save successfully!"));
                                // console.log(chalk.green("your total cost: "+total));
                                console.log("====================");
                            }
                        );
                    } else {
                        console.log("this is a number");
                        // var prod_sales = parseInt(chosenItem.product_sales) + parseInt(total);
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    product_sales: prod_sales
                                },
                                {
                                    item_id: chosenItem.item_id
                                }
                            ],
                            function (err) {
                                if (err) throw err;
                                console.log("====================");
                                console.log(chalk.green("order save successfully!"));
                                // console.log(chalk.green("your total cost: "+total));
                                console.log("====================");
                            }
                        );
                    }



                }
                else {
                    // quantity wasn't match enough, so apologize and start over
                    console.log("====================");
                    console.log("Insufficient quantity! Try again...");
                    console.log("====================");
                    start();
                }
            })
        });
}

