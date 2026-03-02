import { Injectable, Inject } from '@nestjs/common';
import { ChatMessageRepository, CHAT_MESSAGE_REPOSITORY } from '../../domain/interfaces/chat-message.repository.interface';
import { ChatMessage } from '../../domain/entities/chat-message.entity';
import { SendMessageDto } from '../dtos/send-message.dto';

@Injectable()
export class SendMessageUseCase {
    constructor(
        @Inject(CHAT_MESSAGE_REPOSITORY)
        private readonly chatMessageRepository: ChatMessageRepository,
    ) { }

    async execute(userId: string, dto: SendMessageDto): Promise<ChatMessage> {
        return this.chatMessageRepository.save({
            roomId: dto.roomId,
            content: dto.content,
            userId,
        });
    }
}
