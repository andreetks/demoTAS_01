import { Module } from '@nestjs/common';
import { DocumentsController } from './presentation/controllers/documents.controller';
import { CreateDocumentUseCase } from './application/use-cases/create-document.use-case';
import { GetDocumentUseCase } from './application/use-cases/get-document.use-case';
import { ListDocumentsUseCase } from './application/use-cases/list-documents.use-case';
import { UpdateDocumentUseCase } from './application/use-cases/update-document.use-case';
import { DeleteDocumentUseCase } from './application/use-cases/delete-document.use-case';
import { PrismaDocumentRepository } from './infrastructure/repositories/prisma-document.repository';
import { DOCUMENT_REPOSITORY } from './domain/interfaces/document.repository.interface';
import { SharedModule } from '../shared/shared.module';

@Module({
    imports: [SharedModule],
    controllers: [DocumentsController],

    providers: [
        CreateDocumentUseCase,
        GetDocumentUseCase,
        ListDocumentsUseCase,
        UpdateDocumentUseCase,
        DeleteDocumentUseCase,
        {
            provide: DOCUMENT_REPOSITORY,
            useClass: PrismaDocumentRepository,
        },
    ],
})
export class DocumentsModule { }
