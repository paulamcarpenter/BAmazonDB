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


var purchasePrompt = function(products){
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
	  			return !isNaN(value);
		  	}
		},
	]).then(function(answer){
		var chosenItem;
		for(var i=0; i<products.length; i++) {
			if(products[i].item_id==answer.item_id)
				chosenItem=products[i];
		}
		// console.log(chosenItem);
		// console.log(parseInt(answer.stock_quantity));
		// console.log(chosenItem.stock_quantity);

		if(chosenItem.stock_quantity >= parseInt(answer.stock_quantity)){
			connection.query("UPDATE products SET ? WHERE ?",[{
				stock_quantity: chosenItem.stock_quantity - answer.stock_quantity

			},{
				item_id: chosenItem.item_id
			}], function(err,res) {
				if(err) throw err

				// console.log(res);

				console.log("Order successfully placed!");
				purchasePrompt();
			});

		} else {
			console.log("We have insufficient quantity!  Please try again!");
			readProducts();

		}
	})
};

// purchasePrompt();


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
 		for(var i=0; i<res.length; i++) {
 			
 			table.push ([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
 		}
		 
  		console.log(table.toString());
  		purchasePrompt(res);
 	});
}; 	

readProducts();

