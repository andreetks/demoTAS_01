import { Module } from '@nestjs/common';
import { DocumentGateway } from './presentation/gateways/document.gateway';
import { CollaborationService } from './application/services/collaboration.service';
import { WsJwtGuard } from './presentation/guards/ws-jwt.guard';
import { AuthModule } from '../auth/auth.module';
import { SharedModule } from '../shared/shared.module';

@Module({
    imports: [AuthModule, SharedModule],
    providers: [DocumentGateway, CollaborationService, WsJwtGuard],
})
export class DocumentCollaborationModule { }
