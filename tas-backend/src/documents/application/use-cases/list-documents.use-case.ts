import { Injectable, Inject } from '@nestjs/common';
import { DOCUMENT_REPOSITORY, DocumentRepository } from '../../domain/interfaces/document.repository.interface';
import { Document } from '../../domain/entities/document.entity';

@Injectable()
export class ListDocumentsUseCase {
    constructor(
        @Inject(DOCUMENT_REPOSITORY)
        private readonly documentRepository: DocumentRepository,
    ) { }

    async execute(ownerId: string, projectId?: string): Promise<Document[]> {
        if (projectId) {
            return this.documentRepository.findByProjectId(projectId);
        }
        return this.documentRepository.findByOwnerId(ownerId);
    }
}
