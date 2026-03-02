import { Document } from '../entities/document.entity';

export const DOCUMENT_REPOSITORY = Symbol('DOCUMENT_REPOSITORY');

export interface DocumentRepository {
    create(document: Partial<Document>): Promise<Document>;
    findById(id: string): Promise<Document | null>;
    findByOwnerId(ownerId: string): Promise<Document[]>;
    update(id: string, document: Partial<Document>): Promise<Document>;
    delete(id: string): Promise<void>;
}
