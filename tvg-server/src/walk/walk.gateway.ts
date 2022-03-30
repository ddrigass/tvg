import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer, WsResponse,
} from "@nestjs/websockets";
import { Server } from 'ws';

@WebSocketGateway(3030)
export class WalkGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('move')
  handleMove(@MessageBody() data: string): null {
    console.log('handled move')
    return null;
  }
}
