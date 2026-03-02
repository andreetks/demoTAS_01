import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { DocumentOperation } from '../../domain/models/document-operation.model';

@Injectable()
export class CollaborationService {
    joinDocumentRoom(client: Socket, documentId: string, userId: string): void {
        const roomName = `document_${documentId}`;
        client.join(roomName);
        // client.to(roomName).emit('user_joined', { userId, documentId }); // Opcional
    }

    leaveDocumentRoom(client: Socket, documentId: string, userId: string): void {
        const roomName = `document_${documentId}`;
        client.leave(roomName);
        // client.to(roomName).emit('user_left', { userId, documentId }); // Opcional
    }

    broadcastOperation(client: Socket, operation: DocumentOperation): void {
        const roomName = `document_${operation.documentId}`;
        // Emite la operación a todos en la sala EXCEPTO al cliente que la envió
        client.to(roomName).emit('receive_operation', operation);
    }
}
