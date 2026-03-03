import { Module } from '@nestjs/common';
import { ProjectsController } from './presentation/controllers/projects.controller';
import { CreateProjectUseCase } from './application/use-cases/create-project.use-case';
import { ListProjectsUseCase } from './application/use-cases/list-projects.use-case';
import { PROJECT_REPOSITORY } from './domain/interfaces/project.repository.interface';
import { PrismaProjectRepository } from './infrastructure/repositories/prisma-project.repository';
import { PrismaService } from '../shared/infrastructure/prisma/prisma.service';

@Module({
    controllers: [ProjectsController],
    providers: [
        CreateProjectUseCase,
        ListProjectsUseCase,
        {
            provide: PROJECT_REPOSITORY,
            useClass: PrismaProjectRepository,
        },
        PrismaService,
    ],
})
export class ProjectsModule { }
