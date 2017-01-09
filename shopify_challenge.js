var request              = require('request');

var page                 = 1;
var token                = "c32313df0d0ef512ca64d5b336a0d7c6";

var base_url             = "https://shopicruit.myshopify.com/admin/orders.json?page=";
var count                = "https://shopicruit.myshopify.com/admin/orders/count.json?page=0&access_token=c32313df0d0ef512ca64d5b336a0d7c6"

var url                  = base_url + String(page) + "&access_token=" + token;

var num_orders_total     = 0;
var num_orders_processed = 0; // number of orders processed so far

var TOTAL_REVENUE        = 0;

// accumulates the total cost of orders for one page, and adds to total order revenue
function processPage() {

	request(url, function(error, response, body) {

		var json   = JSON.parse(body)
		var orders = json.orders

		for (var i = 0; i < orders.length; i++) {
			
			num_orders_processed += 1
			TOTAL_REVENUE        += Number(orders[i].total_price)

		};

		// if we are not done yet, call function on next page
		if (num_orders_processed < num_orders_total) {

			page += 1
			url   = base_url + String(page) + "&access_token=" + token;

			processPage()

		} else {

			// we are done
			console.log( String(TOTAL_REVENUE) )

		}

	})

}

// first we get the total number of orders across all pages
request(count, function(error, response, body){

	if (!error && response.statusCode == 200) {

		var json         = JSON.parse(body)
		num_orders_total = Number(json.count) // total number of orders across all pages

		// process orders for all pages
		processPage()

	}

})
