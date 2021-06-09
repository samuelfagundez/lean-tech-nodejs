
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');

import { dbConnection } from '../database/config';

class Server {
  app: any;
  port: string;
  server: any;
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // Connect db
    dbConnection();

    // Http server
    this.server = http.createServer(this.app);
  }

  middlewares() {
    // Deploy public static server
    this.app.use(express.static(path.resolve(__dirname, '../public')));

    // Cors
    this.app.use(cors());

    // Body parsing
    this.app.use(express.json());
    // API
    this.app.use('/api/orders', require('../router/order'));

    // Not found route handler
    this.app.use(function (req, res, next) {
      res.status(404).send(`Unable to find the requested resource! ${req.url}`);
    });
  }

  execute() {
    // Middlewares init
    this.middlewares();

    // Inicializar Server
    this.server.listen(this.port, () => {
      console.log('Server running on port:', this.port);
    });
  }
}

export default Server;
