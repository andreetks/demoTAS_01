import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { DocumentOperation } from '../../domain/models/document-operation.model';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class CollaborationService {
    // In-memory document contents for active sessions
    private documentContents: Map<string, string> = new Map();
    // Track active users per document
    private activeUsers: Map<string, Map<string, { id: string; name: string; color: string }>> = new Map();
    // User colors palette
    private colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#14b8a6'];

    constructor(private readonly prisma: PrismaService) { }

    async joinDocumentRoom(client: Socket, documentId: string, user: { id: string; name: string }): Promise<{ content: string; activeUsers: any[] }> {
        const roomName = `document_${documentId}`;
        client.join(roomName);

        // Load document content from DB if not in memory
        if (!this.documentContents.has(documentId)) {
            const doc = await this.prisma.document.findUnique({ where: { id: documentId } });
            if (doc) {
                const content = typeof doc.content === 'string' ? doc.content : (doc.content as any)?.text || '';
                this.documentContents.set(documentId, content);
            } else {
                this.documentContents.set(documentId, '');
            }
        }

        // Track active user
        if (!this.activeUsers.has(documentId)) {
            this.activeUsers.set(documentId, new Map());
        }
        const usersMap = this.activeUsers.get(documentId)!;
        const colorIndex = usersMap.size % this.colors.length;
        usersMap.set(user.id, { id: user.id, name: user.name, color: this.colors[colorIndex] });

        // Notify others that a new user joined
        client.to(roomName).emit('user_joined', { id: user.id, name: user.name, color: this.colors[colorIndex] });

        return {
            content: this.documentContents.get(documentId) || '',
            activeUsers: Array.from(usersMap.values()),
        };
    }

    async leaveDocumentRoom(client: Socket, documentId: string, userId: string): Promise<void> {
        const roomName = `document_${documentId}`;
        client.leave(roomName);

        // Remove from active users
        const usersMap = this.activeUsers.get(documentId);
        if (usersMap) {
            usersMap.delete(userId);
            if (usersMap.size === 0) {
                // Last user left — persist to DB and clean up memory
                await this.saveDocument(documentId);
                this.documentContents.delete(documentId);
                this.activeUsers.delete(documentId);
            }
        }

        // Notify others
        client.to(roomName).emit('user_left', { userId });
    }

    handleContentUpdate(client: Socket, documentId: string, content: string, userId: string): void {
        const roomName = `document_${documentId}`;
        // Update in-memory content
        this.documentContents.set(documentId, content);
        // Broadcast to everyone else in the room
        client.to(roomName).emit('content_updated', { content, userId });
    }

    broadcastOperation(client: Socket, operation: DocumentOperation): void {
        const roomName = `document_${operation.documentId}`;
        client.to(roomName).emit('receive_operation', operation);
    }

    async saveDocument(documentId: string): Promise<void> {
        const content = this.documentContents.get(documentId);
        if (content === undefined) return;

        try {
            await this.prisma.document.update({
                where: { id: documentId },
                data: { content: { text: content } },
            });
        } catch (error) {
            console.error(`Error saving document ${documentId}:`, error.message);
        }
    }

    // Periodic save for all active documents
    async saveAllActiveDocuments(): Promise<void> {
        for (const [documentId] of this.documentContents) {
            await this.saveDocument(documentId);
        }
    }
}
