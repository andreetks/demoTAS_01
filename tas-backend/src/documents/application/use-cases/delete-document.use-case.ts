import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DOCUMENT_REPOSITORY, DocumentRepository } from '../../domain/interfaces/document.repository.interface';

@Injectable()
export class DeleteDocumentUseCase {
    constructor(
        @Inject(DOCUMENT_REPOSITORY)
        private readonly documentRepository: DocumentRepository,
    ) { }

    async execute(id: string, ownerId: string): Promise<void> {
        const document = await this.documentRepository.findById(id);

        if (!document) {
            throw new NotFoundException('Document not found');
        }

        if (document.ownerId !== ownerId) {
            throw new ForbiddenException('You can only delete your own documents');
        }

        await this.documentRepository.delete(id);
    }
}
