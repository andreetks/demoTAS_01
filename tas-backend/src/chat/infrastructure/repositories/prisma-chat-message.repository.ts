import { Injectable } from '@nestjs/common';
import { ChatMessageRepository } from '../../domain/interfaces/chat-message.repository.interface';
import { ChatMessage } from '../../domain/entities/chat-message.entity';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaChatMessageRepository implements ChatMessageRepository {
    constructor(private readonly prisma: PrismaService) { }

    async save(data: { roomId: string; content: string; userId: string }): Promise<ChatMessage> {
        const message = await this.prisma.chatMessage.create({
            data: {
                roomId: data.roomId,
                content: data.content,
                userId: data.userId,
            },
            include: { user: true },
        });
        return this.mapToEntity(message);
    }

    async findByRoom(roomId: string, limit: number): Promise<ChatMessage[]> {
        const messages = await this.prisma.chatMessage.findMany({
            where: { roomId },
            orderBy: { createdAt: 'asc' },
            take: limit,
            include: { user: true },
        });
        return messages.map(msg => this.mapToEntity(msg));
    }

    private mapToEntity(prismaMessage: any): ChatMessage {
        return new ChatMessage(
            prismaMessage.id,
            prismaMessage.roomId,
            prismaMessage.content,
            prismaMessage.userId,
            prismaMessage.user?.name ?? 'Unknown',
            prismaMessage.createdAt,
        );
    }
}
