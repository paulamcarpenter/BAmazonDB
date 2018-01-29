var inquirer = require ("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "root",
	database: "bamazondb"
})

 // connection.connect(function(err){
	// console.log("Connected as id " + connection.threadId);
 // })

var purchasePrompt = function() {
 	inquirer.prompt([
	 	{
	 		name: 'item_id',
	  		type: 'input',
	  		message:  "What item ID would you like to purchase?",
		},
	 	{
	 		name: 'numberOfUnitsToPurchase',
	  		type: 'input',
	  		message:  "How many items would you like to purchase?",
		},
	]).then(function(answer) {
		connection.query("SELECT stock_quantity FROM products WHERE item_id = " + answer.item_id, function(err, res) {
			if (err) throw err;
			// Log all results of the SELECT statement
			console.log(res);
		});
		connection.end();

 		//console.log(answer.item_id);
	});
};


function readProducts() {
 	console.log("Items available for purchase...\n");
 	connection.query("SELECT * FROM products", function(err, res) {
 		if (err) throw err;
 		// Log all results of the SELECT statement
 		console.log(res);
 		var table = new Table({ 
 			head: ["Item ID", "Product Name", "Department Name", "Price", "Stock Quantity"], 
 			colWidths: [15, 15, 15, 15, 15],
 			compact: false 
 		});
 		
  		var arrayOfProducts = [];

   		res.forEach(function(product) {
 		
		var productArr = [];
   		productArr.push(product.item_id, product.product_name, product.department_name, product.price, product.stock_quantity);
   
	    arrayOfProducts.push(productArr);
	
		table.push(arrayOfProducts);
		 
  			 console.log(table.toString());
		});
	});
};

purchasePrompt();

readProducts();

// var readProducts = function(){
// 	connection.query("SELECT * FROM products", function(err,res){
// 		console.log(res);
// 		inquirer.prompt({
// 			name:"choice",/ 			type:"rawlist",
// 			choices:function(value){
// 				var choiceArray = [];
// 					for(var i=0; i<res.length; i++){
// 						choiceArray.push(res[i].itemname);
// 					}
// 					return choiceArray;
// 			},
// 			message: "What product would you like to order?",
// 		}).then(function(answer){
// 			for(var i=0; i<res.length; i++){
// 				if(res[i].itemname==answer.choice){
// 					var chosenItem = res[i];
// 					inquirer.prompt({
// 						name:"name",
// 						type:"input",
// 						message:"How many would you like to order?",
// 						validate:function(value){
// 								  	if(isNaN(value)==false){
// 								  		return true;
// 								  	} else {
// 								  		return false;
// 								  	}
// 						}
// 					}).then(function(answer){
// 						if(chosenItem.howmany < parseInt(answer.chosenItem)){
// 							connection.query("UPDATE products SET ? WHERE ?",[{
// 								highestbid: answer.name

// 							},{
// 								id: chosenItem.id
// 							}], function(err,res) {
// 								console.log("Order successfully placed!");
// 								purchasePrompt();
// 							});
// 						} else {
// 							console.log("We are out of stock, try a different quantity!");
// 							purchasePrompt();
//  						}
// 					})
// 				}
// 			}
// 		})
// 	})	
// }

// readProducts();

