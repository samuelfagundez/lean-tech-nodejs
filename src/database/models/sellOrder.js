const { Schema, model } = require("mongoose");

const SellOrderSchema = Schema(
  {
    fecha: {
      type: Date,
      default: Date.now,
      required: true,
    },
    cantidad: {
      type: Number,
      min: 0,
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
  }
);

SellOrderSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();

  object.id = _id;
  return object;
});

module.exports = model("SellOrder", SellOrderSchema);
