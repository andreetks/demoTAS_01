import { Injectable, Inject } from '@nestjs/common';
import { ChatMessageRepository, CHAT_MESSAGE_REPOSITORY } from '../../domain/interfaces/chat-message.repository.interface';
import { ChatMessage } from '../../domain/entities/chat-message.entity';

@Injectable()
export class GetRoomHistoryUseCase {
    constructor(
        @Inject(CHAT_MESSAGE_REPOSITORY)
        private readonly chatMessageRepository: ChatMessageRepository,
    ) { }

    async execute(roomId: string, limit = 50): Promise<ChatMessage[]> {
        return this.chatMessageRepository.findByRoom(roomId, limit);
    }
}
