import Server from './src/server.mjs';
import https from 'https';
import fs from 'fs';

const server = new Server();

const options = {
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem')
};

server.run = async function () {
  try {
    await this.dbConnect();
    this.security();
    this.middleware();
    this.routes();
    https.createServer(options, this.app).listen(this.config.port, () => {
      console.log(`HTTPS server running on port ${this.config.port}`);
    });
  } catch (err) {
    console.error(`[ERROR] Server -> ${err}`);
  }
}.bind(server);

server.run();
