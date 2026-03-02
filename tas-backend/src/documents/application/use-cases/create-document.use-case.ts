import { Injectable, Inject } from '@nestjs/common';
import { DOCUMENT_REPOSITORY, DocumentRepository } from '../../domain/interfaces/document.repository.interface';
import { CreateDocumentDto } from '../dtos/create-document.dto';
import { Document } from '../../domain/entities/document.entity';

@Injectable()
export class CreateDocumentUseCase {
    constructor(
        @Inject(DOCUMENT_REPOSITORY)
        private readonly documentRepository: DocumentRepository,
    ) { }

    async execute(ownerId: string, createDocumentDto: CreateDocumentDto): Promise<Document> {
        return this.documentRepository.create({
            ...createDocumentDto,
            ownerId,
        });
    }
}
