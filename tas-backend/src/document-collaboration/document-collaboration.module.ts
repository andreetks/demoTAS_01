import { Module } from '@nestjs/common';
import { DocumentGateway } from './presentation/gateways/document.gateway';
import { CollaborationService } from './application/services/collaboration.service';
import { WsJwtGuard } from './presentation/guards/ws-jwt.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    providers: [DocumentGateway, CollaborationService, WsJwtGuard],
})
export class DocumentCollaborationModule { }

