import { Module } from '@nestjs/common';
import { DocumentsController } from './presentation/controllers/documents.controller';
import { CreateDocumentUseCase } from './application/use-cases/create-document.use-case';
import { GetDocumentUseCase } from './application/use-cases/get-document.use-case';
import { ListDocumentsUseCase } from './application/use-cases/list-documents.use-case';
import { UpdateDocumentUseCase } from './application/use-cases/update-document.use-case';
import { DeleteDocumentUseCase } from './application/use-cases/delete-document.use-case';
import { PrismaDocumentRepository } from './infrastructure/repositories/prisma-document.repository';
import { DOCUMENT_REPOSITORY } from './domain/interfaces/document.repository.interface';

// Asegúrate de importar el PrismaModule real
// import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';

@Module({
    // imports: [PrismaModule],
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
