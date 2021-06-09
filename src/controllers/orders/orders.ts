import apiErrors from '../../constants/apiErrors'
import {
  findProductQuery,
  calculateBuyAmountsInATimeLapseQuery,
  incrementStockQuery,
  createProductQuery,
  createBuyOrderQuery,
  reduceStockQuery,
  createSellOrderQuery,
  calculateStockBeforeADateQuery,
} from '../../queries/ordersQueries'

/* 

Controller for 

/api/orders/registrar-compra

Description: Allows you to register a product buy.

*/

const loadBuyOrder = async (req, res) => {
  //Read body
  const { fecha, cantidad, nombreProducto }: { fecha: Date, cantidad: number, nombreProducto: string } = req.body;
  let { idProducto }: { idProducto: number | string } = req.body;
  // return stock variable
  let stock;
  // Normalize product id
  idProducto = idProducto.toString();
  // Date construct
  //Month concerning to the provided date
  const actualMonth = new Date(fecha);
  actualMonth.setHours(0);
  actualMonth.setMinutes(0);
  actualMonth.setSeconds(0);
  actualMonth.setDate(0);

  try {
    // Find product
    const product = await findProductQuery(idProducto);
    // If it doesn't exist
    if (!product) {
      // Insert product in the stock table
      await createProductQuery(idProducto, cantidad, nombreProducto);
      stock = cantidad;
      // If product exists
    } else {
      // Count the number of products bought in the same month
      const buyStockSearch = await calculateBuyAmountsInATimeLapseQuery(idProducto, actualMonth, fecha);

      // ir there are buy orders in the same month
      if(buyStockSearch[0]) {
        // if stock + qty doesn't exceeds the business rule, save the buy.
        if (buyStockSearch[0].buyStock + cantidad <= 30) {
          const updatedStock = await incrementStockQuery(idProducto, cantidad);
          stock = updatedStock.stock + cantidad;
        }
        // if business rules doesn't pass then fails
        else
          return res.status(406).json({
            ok: false,
            msg: apiErrors.EXCEED_ERROR,
          });
      // If there are not any orders in the same month register the order
      } else {
        const updatedStock = await incrementStockQuery(idProducto, cantidad);
        stock = updatedStock.stock + cantidad;
      }

    }

    // Register buy.
    const buyOrder = await createBuyOrderQuery(fecha, cantidad, nombreProducto, idProducto);

    //Response
    res.json({
      ok: true,
      buyOrder,
      stock,
    });
    // Crash handler
  } catch (err) {
    console.log(`${new Date().toISOString()} Error`, err);
    res.status(500).json({
      ok: false,
      msg: apiErrors.FATAL_ERROR,
    });
  }
}

/* 

Controller for 

/api/orders/registrar-venta

Description: Allows you to register a product sell.

*/

const generateSellOrder = async (req, res) => {
  // Read body
  const { fecha, cantidad }: { fecha: Date, cantidad: number} = req.body;
  let { idProducto }: { idProducto: string | number } = req.body;
  //Normalize product id
  idProducto = idProducto.toString();
  // Variable to store the sellOrder query response
  let sellOrder;

  try {

    // Calculate if there is stock available for the sell date
    const actualStock = await calculateStockBeforeADateQuery(
      idProducto,
      fecha
    );

    // If there is not stock available for the sell date, error
    if (actualStock < cantidad) {
      return res.status(404).json({
        ok: false,
        msg: apiErrors.NOT_AVAILABLE_ERROR,
      });
    }

    // Atomic sell operation
    const updatedProduct = await reduceStockQuery(idProducto, cantidad);

    // If success, register the transaction
    if (updatedProduct) {
      sellOrder = await createSellOrderQuery(fecha, cantidad, idProducto, updatedProduct.nombreProducto);
    // other way, rise error
    } else {
      return res.status(404).json({
        ok: false,
        msg: apiErrors.NOT_AVAILABLE_ERROR,
      });
    }
  
    //Response
    res.json({
      ok: true,
      sellOrder,
      stock: updatedProduct.stock - cantidad,
    });
  } catch(err) {
     console.log(`${new Date().toISOString()} Error`, err);
     res.status(500).json({
       ok: false,
       msg: apiErrors.FATAL_ERROR,
     });
  }
}

export { loadBuyOrder, generateSellOrder };