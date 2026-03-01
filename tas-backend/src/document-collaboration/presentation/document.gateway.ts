import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/docs' })
export class DocumentGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Document Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Document Client disconnected: ${client.id}`);
    }
}
