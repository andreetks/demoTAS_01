import { Module } from '@nestjs/common';
import { ChatGateway } from './presentation/chat.gateway';
import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { GetRoomHistoryUseCase } from './application/use-cases/get-room-history.use-case';
import { PrismaChatMessageRepository } from './infrastructure/repositories/prisma-chat-message.repository';
import { CHAT_MESSAGE_REPOSITORY } from './domain/interfaces/chat-message.repository.interface';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [SharedModule, AuthModule],
    providers: [
        ChatGateway,
        SendMessageUseCase,
        GetRoomHistoryUseCase,
        {
            provide: CHAT_MESSAGE_REPOSITORY,
            useClass: PrismaChatMessageRepository,
        },
    ],
})
export class ChatModule { }
