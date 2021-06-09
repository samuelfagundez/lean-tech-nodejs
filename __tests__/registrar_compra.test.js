const axios = require('axios');
require("dotenv").config();

const instance = axios.create({
  baseURL: `http://localhost:${process.env.PORT}/api`,
});

test("Be able to register a buy order, tests POST /api/orders/registrar-compra", (done) => {
    instance
      .post("/orders/registrar-compra", {
        fecha: "2021-06-06T19:36:47.000+00:00",
        cantidad: 10,
        idProducto: new Date().toISOString(),
        nombreProducto: `random product name ${new Date().toISOString()}`,
      })
      .then((res) => {
        done(expect(res.data.ok).toBe(true));
      })
      .catch((err) => {
        done(err);
      });
});

test("Fail to register a buy order by exceeding qty, tests POST /api/orders/registrar-compra", (done) => {
    instance
      .post("/orders/registrar-compra", {
        fecha: "2021-06-06T19:36:47.000+00:00",
        cantidad: 40,
        idProducto: new Date().toISOString(),
        nombreProducto: `random product name ${new Date().toISOString()}`,
      })
      .catch((err) => {
        done(expect(err.response.data.ok).toBe(false));
      });
});

test("Fail to register a buy order by missing fields, tests POST /api/orders/registrar-compra", (done) => {
  instance
    .post("/orders/registrar-compra", {
      fecha: "2021-06-06T19:36:47.000+00:00",
      cantidad: 20,
      nombreProducto: `random product name ${new Date().toISOString()}`,
    })
    .catch((err) => {
      done(expect(err.response.data.ok).toBe(false));
    });
});
