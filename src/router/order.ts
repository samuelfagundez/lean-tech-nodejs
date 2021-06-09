import { Router } from 'express'
import { loadBuyOrder, generateSellOrder } from '../controllers/orders/orders'
import { check } from 'express-validator'
import { validateFields } from '../middlewares/validateFields'
import buyValidator from '../validators/orders/buyOrderValidator'
import sellValidator from '../validators/orders/sellOrderValidator'

const router = Router();

router.post(
  "/registrar-compra",
  [
    check("fecha", "Date must be ISO8601 format").isISO8601().toDate(),
    check("cantidad", "Quantity is not valid").isNumeric().not().isEmpty(),
    check("idProducto", "Product id is not valid").not().isEmpty(),
    check("nombreProducto", "Product name is not valid")
      .isString()
      .not()
      .isEmpty(),
      validateFields,
    ],
    buyValidator,
  loadBuyOrder
);

router.post(
  "/registrar-venta",
  [
    check("fecha", "Date must be ISO8601 format").isISO8601().toDate(),
    check("cantidad", "Quantity is not valid").isNumeric().not().isEmpty(),
    check("idProducto", "Product id is not valid").not().isEmpty(),
    validateFields,
  ],
  sellValidator,
  generateSellOrder
);

export default router;
module.exports = router;