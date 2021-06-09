const { Schema, model } = require("mongoose");

const BuyOrderSchema = Schema({
  fecha: {
    type: Date,
    default: Date.now,
  },
  cantidad: {
    type: Number,
    min: 1,
    required: true,
  },
  idProducto: {
    type: String,
    required: true,
  },
  nombreProducto: {
    type: String,
    required: true,
  },
});

BuyOrderSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();

  object.id = _id;
  return object;
});

module.exports = model("BuyOrder", BuyOrderSchema);
