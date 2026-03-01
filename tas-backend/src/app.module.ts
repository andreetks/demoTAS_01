import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './permissions/permissions.module';
import { DocumentsModule } from './documents/documents.module';
import { DocumentCollaborationModule } from './document-collaboration/document-collaboration.module';
import { ChatModule } from './chat/chat.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [AuthModule, PermissionsModule, DocumentsModule, DocumentCollaborationModule, ChatModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
