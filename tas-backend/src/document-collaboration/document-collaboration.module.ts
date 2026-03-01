import { Module } from '@nestjs/common';
import { DocumentGateway } from './presentation/document.gateway';

@Module({
    providers: [DocumentGateway],
})
export class DocumentCollaborationModule { }
