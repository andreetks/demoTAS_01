import { Injectable, Inject } from '@nestjs/common';
import { PROJECT_REPOSITORY, ProjectRepository } from '../../domain/interfaces/project.repository.interface';
import { Project } from '../../domain/entities/project.entity';

@Injectable()
export class ListProjectsUseCase {
    constructor(
        @Inject(PROJECT_REPOSITORY)
        private readonly projectRepository: ProjectRepository,
    ) { }

    async execute(groupId: string): Promise<Project[]> {
        return this.projectRepository.findByGroupId(groupId);
    }
}
