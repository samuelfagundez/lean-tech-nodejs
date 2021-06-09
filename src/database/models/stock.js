const { Schema, model } = require("mongoose");

const StockSchema = Schema({
  idProducto: {
    type: String,
    required: true,
    unique: true,
  },
  nombreProducto: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    min: 0,
    default: 0,
  },
});

StockSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();

  object.id = _id;
  return object;
});

module.exports = model("Stock", StockSchema);
