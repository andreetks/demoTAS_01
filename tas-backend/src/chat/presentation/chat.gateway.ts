import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
    WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { SendMessageUseCase } from '../application/use-cases/send-message.use-case';
import { GetRoomHistoryUseCase } from '../application/use-cases/get-room-history.use-case';
import { SendMessageDto } from '../application/dtos/send-message.dto';

@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly jwtService: JwtService,
        private readonly sendMessageUseCase: SendMessageUseCase,
        private readonly getRoomHistoryUseCase: GetRoomHistoryUseCase,
    ) { }

    async handleConnection(client: Socket) {
        try {
            const token =
                client.handshake.auth?.token ||
                client.handshake.headers?.authorization?.replace('Bearer ', '');

            if (!token) throw new WsException('Missing token');

            const payload = this.jwtService.verify(token);
            client.data.user = { userId: payload.sub, email: payload.email, name: payload.name };
            console.log(`Chat connected: ${client.id} (${payload.email})`);
        } catch {
            console.warn(`Chat unauthorized connection: ${client.id}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        console.log(`Chat disconnected: ${client.id}`);
    }

    @SubscribeMessage('join_room')
    async handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { roomId: string },
    ) {
        if (!client.data.user) throw new WsException('Unauthorized');

        const { roomId } = payload;
        await client.join(roomId);

        const history = await this.getRoomHistoryUseCase.execute(roomId, 50);
        client.emit('room_history', history);

        return { event: 'joined_room', data: { roomId } };
    }

    @SubscribeMessage('send_message')
    async handleSendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() dto: SendMessageDto,
    ) {
        if (!client.data.user) throw new WsException('Unauthorized');

        const userId = client.data.user.userId;
        const message = await this.sendMessageUseCase.execute(userId, dto);

        // Broadcast to everyone in the room (including sender)
        this.server.to(dto.roomId).emit('new_message', message);

        return { event: 'message_sent', data: message };
    }

    @SubscribeMessage('leave_room')
    async handleLeaveRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { roomId: string },
    ) {
        const { roomId } = payload;
        await client.leave(roomId);
        return { event: 'left_room', data: { roomId } };
    }
}
