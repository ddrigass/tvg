import { Server as SocketServer } from 'socket.io';
import http from 'http';
import app from '../app';
import config from '../config';

let server = http.createServer();
let io = new SocketServer(server);

app(io);
server.listen(config.socketServerPort);

export default server