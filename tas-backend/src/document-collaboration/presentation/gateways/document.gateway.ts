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
import { UseGuards } from '@nestjs/common';
import { CollaborationService } from '../../application/services/collaboration.service';
import { DocumentOperation } from '../../domain/models/document-operation.model';
import { WsJwtGuard } from '../guards/ws-jwt.guard';

@WebSocketGateway({ namespace: '/documents', cors: true })
export class DocumentGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly collaborationService: CollaborationService) { }

    handleConnection(client: Socket) {
        // connection logic (if needed)
    }

    handleDisconnect(client: Socket) {
        // disconnection logic (if needed)
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('join_document')
    handleJoinDocument(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { documentId: string },
    ) {
        const userId = (client as any).user.id;
        this.collaborationService.joinDocumentRoom(client, payload.documentId, userId);
        return { event: 'joined_document', data: { documentId: payload.documentId } };
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('leave_document')
    handleLeaveDocument(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { documentId: string },
    ) {
        const userId = (client as any).user.id;
        this.collaborationService.leaveDocumentRoom(client, payload.documentId, userId);
        return { event: 'left_document', data: { documentId: payload.documentId } };
    }

    @UseGuards(WsJwtGuard)
    @SubscribeMessage('send_operation')
    handleSendOperation(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: Omit<DocumentOperation, 'userId' | 'timestamp'>,
    ) {
        const userId = (client as any).user.id;

        const operation: DocumentOperation = {
            ...payload,
            userId,
            timestamp: new Date(),
        };

        this.collaborationService.broadcastOperation(client, operation);
    }
}
