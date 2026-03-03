import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CreateProjectUseCase } from '../../application/use-cases/create-project.use-case';
import { ListProjectsUseCase } from '../../application/use-cases/list-projects.use-case';
import { CreateProjectDto } from '../../application/dtos/create-project.dto';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
    constructor(
        private readonly createProjectUseCase: CreateProjectUseCase,
        private readonly listProjectsUseCase: ListProjectsUseCase,
    ) { }

    @Post()
    async create(@Request() req, @Body() createProjectDto: CreateProjectDto) {
        const groupId = req.user.groupId;
        if (!groupId) {
            console.error(`ERROR: User ${req.user.email} has no groupId in token!`);
        }
        return this.createProjectUseCase.execute(groupId, createProjectDto);
    }

    @Get()
    async list(@Request() req) {
        const groupId = req.user.groupId;
        if (!groupId) {
            console.error(`ERROR: User ${req.user.email} has no groupId in token!`);
        }
        return this.listProjectsUseCase.execute(groupId);
    }
}
