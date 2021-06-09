// Server Config
import Server from './src/models/server'
// Read envs package
require('dotenv').config();

// Instance server init
const server = new Server();

// Run Server
server.execute();