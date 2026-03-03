import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../domain/interfaces/project.repository.interface';
import { Project } from '../../domain/entities/project.entity';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaProjectRepository implements ProjectRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: { name: string; groupId: string; description?: string }): Promise<Project> {
        const project = await this.prisma.project.create({
            data: {
                name: data.name,
                groupId: data.groupId,
                description: data.description,
            },
        });
        return this.mapToEntity(project);
    }

    async findByGroupId(groupId: string): Promise<Project[]> {
        const projects = await this.prisma.project.findMany({
            where: { groupId },
            orderBy: { createdAt: 'desc' },
        });
        return projects.map(p => this.mapToEntity(p));
    }

    async findById(id: string): Promise<Project | null> {
        const project = await this.prisma.project.findUnique({
            where: { id },
        });
        if (!project) return null;
        return this.mapToEntity(project);
    }

    private mapToEntity(prismaProject: any): Project {
        return new Project(
            prismaProject.id,
            prismaProject.name,
            prismaProject.groupId,
            prismaProject.createdAt,
            prismaProject.updatedAt,
            prismaProject.description,
        );
    }
}
