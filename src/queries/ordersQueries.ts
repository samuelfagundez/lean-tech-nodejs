const BuyOrder = require('../database/models/buyOrder');
const SellOrder = require('../database/models/sellOrder');
const Stock = require('../database/models/stock');
import { BuyOrderModel, SellOrderModel, StockModel } from '../models/orders'

const findProductQuery = async (productId: string): Promise<StockModel> => await Stock.findOne({ idProducto: productId });

const calculateBuyAmountsInATimeLapseQuery = async (
  productId: string,
  actualMonth: Date,
  date: Date
): Promise<{ buyStock: number }[]> =>
  await BuyOrder.aggregate([
    {
      $match: {
        idProducto: productId,
        fecha: {
          $gte: new Date(actualMonth),
          $lte: new Date(date),
        },
      },
    },
    {
      $group: {
        _id: "",
        buyStock: { $sum: "$cantidad" },
      },
    },
  ]);

const calculateStockBeforeADateQuery = async (
  productId: string,
  date: Date
): Promise<number> => {
  let stock = 0;
  const buyAmount = await BuyOrder.aggregate([
    {
      $match: {
        idProducto: productId,
        fecha: {
          $lte: new Date(date),
        },
      },
    },
    {
      $group: {
        _id: "",
        buyStock: { $sum: "$cantidad" },
      },
    },
  ])
  const sellAmount = await SellOrder.aggregate([
    {
      $match: {
        idProducto: productId,
        fecha: {
          $lte: new Date(date),
        },
      },
    },
    {
      $group: {
        _id: "",
        sellStock: { $sum: "$cantidad" },
      },
    },
  ]);
  if(buyAmount[0]) stock += buyAmount[0].buyStock;
  if(sellAmount[0]) stock -= sellAmount[0].sellStock;
  return stock;
};

const incrementStockQuery = async (productId: string, qty: number): Promise<StockModel> =>
  await Stock.findOneAndUpdate({ idProducto: productId }, { $inc: { stock: qty } });

const reduceStockQuery = async (productId: string, qty: number): Promise<StockModel> =>
  await Stock.findOneAndUpdate(
    { idProducto: productId, stock: { $gte: qty } },
    { $inc: { stock: -qty } }
  );

const createProductQuery = async (productId: string, qty: number, productName: string): Promise<StockModel> => {
  const newProduct = new Stock({ idProducto: productId, stock: qty, nombreProducto: productName });
  return await newProduct.save();
}

const createBuyOrderQuery = async (date: Date, qty: number, productName: string, productId: string): Promise<BuyOrderModel> => {
  const buyOrder = new BuyOrder({
    fecha: date,
    cantidad: qty,
    nombreProducto: productName,
    idProducto: productId,
  });
  return await buyOrder.save();
};

const createSellOrderQuery = async (date: Date, qty: number, productId: string, productName: string): Promise<SellOrderModel> => {
  const sellOrder = new SellOrder({
    fecha: date,
    cantidad: qty,
    idProducto: productId,
    nombreProducto: productName,
  });

  return await sellOrder.save();
};

export {
  findProductQuery,
  calculateBuyAmountsInATimeLapseQuery,
  incrementStockQuery,
  createProductQuery,
  createBuyOrderQuery,
  reduceStockQuery,
  createSellOrderQuery,
  calculateStockBeforeADateQuery,
};
