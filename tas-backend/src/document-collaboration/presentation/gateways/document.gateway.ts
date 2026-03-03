import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CollaborationService } from '../../application/services/collaboration.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ namespace: '/documents', cors: { origin: '*' } })
export class DocumentGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly collaborationService: CollaborationService,
        private readonly jwtService: JwtService,
    ) { }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            (client as any).user = { id: payload.sub, email: payload.email, name: payload.name || payload.email };
        } catch (error) {
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        // Cleanup handled by leave_document events
    }

    @SubscribeMessage('join_document')
    async handleJoinDocument(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { documentId: string },
    ) {
        const user = (client as any).user;
        if (!user) return;

        const result = await this.collaborationService.joinDocumentRoom(
            client,
            payload.documentId,
            { id: user.id, name: user.name },
        );

        return { event: 'document_loaded', data: result };
    }

    @SubscribeMessage('leave_document')
    async handleLeaveDocument(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { documentId: string },
    ) {
        const user = (client as any).user;
        if (!user) return;

        await this.collaborationService.leaveDocumentRoom(client, payload.documentId, user.id);
        return { event: 'left_document', data: { documentId: payload.documentId } };
    }

    @SubscribeMessage('update_content')
    handleUpdateContent(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { documentId: string; content: string },
    ) {
        const user = (client as any).user;
        if (!user) return;

        this.collaborationService.handleContentUpdate(client, payload.documentId, payload.content, user.id);
    }

    @SubscribeMessage('save_document')
    async handleSaveDocument(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { documentId: string },
    ) {
        await this.collaborationService.saveDocument(payload.documentId);
        return { event: 'document_saved', data: { documentId: payload.documentId } };
    }
}
