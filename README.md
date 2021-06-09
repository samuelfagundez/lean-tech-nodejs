### Features

- Register buy orders from today or before;
- Register sell orders from today or before;

# Lean Tech NodeJS Challenge

The idea for this project is to build a classic stock app where you can register buys and sells for your products, and making a guarantee that the stock always match.

How to run
-------------

Locate on the project folder root, then run `docker-compose build`, after having the images run `docker-compose up`. Now you have an instance of the app running in `localhost:8080` and a mongo instance running on `localhost:27017`.

How to test
-------------

Having your app running, locate on the project folder root and run `npm test`, take in consideration that the tests will be running on the same database, i recommend to build a new instance for testing but didn't include it to simplify.

API
-------------

The base route for the API is `/api`

- POST /api/orders/registrar-compra
```
{
"fecha": "2021-05-08T22:59:50.885Z",
"cantidad": 24,
"idProducto": "AB20",
"nombreProducto": "producto 20"
}
```

- POST /api/orders/registrar-venta
```
{
	"fecha": "2021-05-08T22:59:50.885Z",
	"cantidad": 24,
	"idProducto": "AB20"
}
```

Business Rules
-------------

- You can not register buys and sells in the future.
- You can not sell anything that exceeds the stock for certain sell date.
- You can not buy more than 30 products in a same month.
- You can not register buys and sells with 0 value.

### Database schema

#### Stock table
                    
_id  | stock | idProducto | nombreProducto
------------- | ------------- | ------------- | ------------- 
ObjectID  | number  | string | string 

#### BuyOrders table
                    
_id  | fecha | cantidad | idProducto | nombreProducto
------------- | ------------- | ------------- | ------------- | ------------- 
ObjectID  | date  | number | string | string 


#### SellOrders table
                    
_id  | fecha | cantidad | idProducto | nombreProducto
------------- | ------------- | ------------- | ------------- | ------------- 
ObjectID  | date  | number | string | string 


