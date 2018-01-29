var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password:"root",
	database: "bamazondb"
})

 // connection.connect(function(err){
 // 	console.log("Connection ID: "+connection.threadId);
 // })


var purchasePrompt = function(){
	inquirer.prompt([
		{
			name: "item_id",
			type: "input",
			message: "What item would you like to purchase?",
			choices: ["1000", "1001", "1002", "1003", "1004", "1005", "1006", "1007", "1008", "1009", "1010"]
		},
		{
	 		name: "stock_quantity",
	  		type: "input",
	  		message:  "How many items would you like to purchase?",
	  		validate: function(value){
		  		if(isNaN(value)==false){
		  			return true;
		  		} else {
		  			return false;
		  		}
			}
		},
	]).then(function(answer){
		var chosenItem = answer;
		if(chosenItem.stock_quantity < parseInt(answer.stock_quantity)){
			connection.query("UPDATE products SET ? WHERE ?",[{
				stock_quantity: answer.chosenItem

			},{
				id: chosenItem.id
			}], function(err,res) {
				console.log("Order successfully placed!");
				purchasePrompt();
			});

		} else {
			console.log("We have insufficient quanitity!  Please try again!");
			purchasePrompt();

		}
	})
};

purchasePrompt();

function readProducts() {
 	console.log("Items available for purchase...\n");
 	connection.query("SELECT * FROM products", function(err, res) {
 		if (err) throw err;
 		// Log all results of the SELECT statement
 			// console.log(res);
 		var arrayOfProducts = [];
 		var table = new Table({ 
 			head: ["Item ID", "Product Name", "Department Name","Price", "Stock Quantity"], 
 			colWidths: [15, 15, 20, 15, 20],
 			style: {compact : true, "padding-left" :1}
 		});

 		// var arrayOfProducts = [];

 		table.push(
 			["1000", "Tires", "Auto", 50, 100],
 			["1001", "Milk", "Groceries", 3, 5000],
 			["1002", "Bananas", "Groceries", 1, 10000],
 			["1003", "Dishes", "Housewares", 25, 200],
 			["1004", "Glasses", "Housewares", 10, 200],
 			["1005", "Tuna", "Groceries", 3, 500],
 			["1006", "Visa Gift Card", "Online Services", 50, 2000],
 			["1007", "Movies", "Online Services", 1, 200000],
 			["1008", "Bread", "Groceries", 3, 200000],
 			["1009", "Light Bulbs", "Housewares", 8, 200],
 			["1010", "Pepsi", "Groceries", 4, 200000]
 		);
		 
  		console.log(table.toString());
 	});
}; 	

readProducts();

