import { Module } from '@nestjs/common';
import { DocumentGateway } from './presentation/gateways/document.gateway';
import { CollaborationService } from './application/services/collaboration.service';

@Module({
    providers: [DocumentGateway, CollaborationService],
})
export class DocumentCollaborationModule { }
