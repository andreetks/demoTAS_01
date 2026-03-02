import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DOCUMENT_REPOSITORY, DocumentRepository } from '../../domain/interfaces/document.repository.interface';
import { Document } from '../../domain/entities/document.entity';

@Injectable()
export class GetDocumentUseCase {
    constructor(
        @Inject(DOCUMENT_REPOSITORY)
        private readonly documentRepository: DocumentRepository,
    ) { }

    async execute(id: string): Promise<Document> {
        const document = await this.documentRepository.findById(id);
        if (!document) {
            throw new NotFoundException('Document not found');
        }
        return document;
    }
}
