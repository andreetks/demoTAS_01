import { Module } from '@nestjs/common';
import { ChatGateway } from './presentation/chat.gateway';

@Module({
    providers: [ChatGateway],
})
export class ChatModule { }
