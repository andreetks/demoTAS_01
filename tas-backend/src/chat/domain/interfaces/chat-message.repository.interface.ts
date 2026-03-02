import { ChatMessage } from '../entities/chat-message.entity';

export const CHAT_MESSAGE_REPOSITORY = Symbol('CHAT_MESSAGE_REPOSITORY');

export interface ChatMessageRepository {
    save(data: { roomId: string; content: string; userId: string }): Promise<ChatMessage>;
    findByRoom(roomId: string, limit: number): Promise<ChatMessage[]>;
}
