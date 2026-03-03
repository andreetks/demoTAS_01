import { Project } from '../entities/project.entity';

export const PROJECT_REPOSITORY = Symbol('PROJECT_REPOSITORY');

export interface ProjectRepository {
    create(data: { name: string; groupId: string; description?: string }): Promise<Project>;
    findByGroupId(groupId: string): Promise<Project[]>;
    findById(id: string): Promise<Project | null>;
}
