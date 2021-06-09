const axios = require("axios");
require("dotenv").config();

const instance = axios.create({
  baseURL: `http://localhost:${process.env.PORT}/api`,
});

test("Be able to register a sell order, tests POST /api/orders/registrar-venta", (done) => {
  instance
    .post("/orders/registrar-compra", {
      fecha: "2021-06-06T19:36:47.000+00:00",
      cantidad: 10,
      idProducto: `${new Date().toISOString()}v`,
      nombreProducto: `random product name ${new Date().toISOString()}`,
    })
    .then((res) => {
      expect(res.data.ok).toBe(true);
      return res.data.buyOrder.idProducto;
    })
    .then((idProducto) => {
      instance
        .post("/orders/registrar-venta", {
          fecha: "2021-06-06T19:36:47.000+00:00",
          cantidad: 10,
          idProducto,
        })
        .then((res) => {
          done(expect(res.data.ok).toBe(true));
        });
    })
    .catch((err) => {
      done(err);
    })
});

test("Can't sell more than the stock, tests POST /api/orders/registrar-venta", (done) => {
  instance
    .post("/orders/registrar-compra", {
      fecha: "2021-06-06T19:36:47.000+00:00",
      cantidad: 10,
      idProducto: `${new Date().toISOString()}v`,
      nombreProducto: `random product name ${new Date().toISOString()}`,
    })
    .then((res) => {
      expect(res.data.ok).toBe(true);
      return res.data.buyOrder.idProducto;
    })
    .then((idProducto) => {
      instance
        .post("/orders/registrar-venta", {
          fecha: "2021-06-06T19:36:47.000+00:00",
          cantidad: 9,
          idProducto,
        })
        .then((res) => {
          done(expect(res.data.ok).toBe(true));
        });
    })
    .catch((err) => {
      done(expect(err.response.data.ok).toBe(false));
    });
});
