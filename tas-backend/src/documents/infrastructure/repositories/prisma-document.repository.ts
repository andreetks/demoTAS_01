import { Injectable } from '@nestjs/common';
import { DocumentRepository } from '../../domain/interfaces/document.repository.interface';
import { Document } from '../../domain/entities/document.entity';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaDocumentRepository implements DocumentRepository {
    constructor(private readonly prisma: PrismaService) { }


    async create(data: Partial<Document>): Promise<Document> {
        const created = await this.prisma.document.create({
            data: {
                title: data.title,
                content: data.content,
                ownerId: data.ownerId,
            },
        });
        return this.mapToEntity(created);
    }

    async findById(id: string): Promise<Document | null> {
        const document = await this.prisma.document.findUnique({
            where: { id },
        });

        if (!document) return null;
        return this.mapToEntity(document);
    }

    async findByOwnerId(ownerId: string): Promise<Document[]> {
        const documents = await this.prisma.document.findMany({
            where: { ownerId },
        });
        return documents.map(doc => this.mapToEntity(doc));
    }

    async update(id: string, data: Partial<Document>): Promise<Document> {
        const updated = await this.prisma.document.update({
            where: { id },
            data: {
                title: data.title !== undefined ? data.title : undefined,
                content: data.content !== undefined ? data.content : undefined,
            },
        });
        return this.mapToEntity(updated);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.document.delete({
            where: { id },
        });
    }

    private mapToEntity(prismaDocument: any): Document {
        return new Document(
            prismaDocument.id,
            prismaDocument.title,
            prismaDocument.content,
            prismaDocument.ownerId,
            prismaDocument.createdAt,
            prismaDocument.updatedAt,
        );
    }
}
