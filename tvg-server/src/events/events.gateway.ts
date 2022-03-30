import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer, WsResponse,
} from "@nestjs/websockets";
import { Server } from 'ws';

@WebSocketGateway(3030)
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('logIn')
  handleLogIn(@MessageBody() data: string): WsResponse<unknown> {
    console.log('handled logIn')
    return {
      event: 'loggedIn',
      data: {}
    };
  }
}
