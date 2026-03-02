import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DOCUMENT_REPOSITORY, DocumentRepository } from '../../domain/interfaces/document.repository.interface';
import { UpdateDocumentDto } from '../dtos/update-document.dto';
import { Document } from '../../domain/entities/document.entity';

@Injectable()
export class UpdateDocumentUseCase {
    constructor(
        @Inject(DOCUMENT_REPOSITORY)
        private readonly documentRepository: DocumentRepository,
    ) { }

    async execute(id: string, ownerId: string, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
        const document = await this.documentRepository.findById(id);

        if (!document) {
            throw new NotFoundException('Document not found');
        }

        if (document.ownerId !== ownerId) {
            throw new ForbiddenException('You can only edit your own documents');
        }

        return this.documentRepository.update(id, updateDocumentDto);
    }
}
