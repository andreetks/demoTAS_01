import { Injectable, Inject } from '@nestjs/common';
import { PROJECT_REPOSITORY, ProjectRepository } from '../../domain/interfaces/project.repository.interface';
import { Project } from '../../domain/entities/project.entity';
import { CreateProjectDto } from '../dtos/create-project.dto';

@Injectable()
export class CreateProjectUseCase {
    constructor(
        @Inject(PROJECT_REPOSITORY)
        private readonly projectRepository: ProjectRepository,
    ) { }

    async execute(groupId: string, dto: CreateProjectDto): Promise<Project> {
        return this.projectRepository.create({
            name: dto.name,
            groupId,
            description: dto.description,
        });
    }
}
