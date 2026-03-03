import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { CreateDocumentUseCase } from '../../application/use-cases/create-document.use-case';
import { GetDocumentUseCase } from '../../application/use-cases/get-document.use-case';
import { ListDocumentsUseCase } from '../../application/use-cases/list-documents.use-case';
import { UpdateDocumentUseCase } from '../../application/use-cases/update-document.use-case';
import { DeleteDocumentUseCase } from '../../application/use-cases/delete-document.use-case';
import { CreateDocumentDto } from '../../application/dtos/create-document.dto';
import { UpdateDocumentDto } from '../../application/dtos/update-document.dto';

// Reemplaza esto con tu ruta real de JwtAuthGuard
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt.guard';
//const JwtAuthGuard = null as any; // MOCK

@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
    constructor(
        private readonly createDocumentUseCase: CreateDocumentUseCase,
        private readonly getDocumentUseCase: GetDocumentUseCase,
        private readonly listDocumentsUseCase: ListDocumentsUseCase,
        private readonly updateDocumentUseCase: UpdateDocumentUseCase,
        private readonly deleteDocumentUseCase: DeleteDocumentUseCase,
    ) { }

    @Post()
    async create(@Request() req, @Body() createDocumentDto: CreateDocumentDto) {
        const userId = req.user.id;
        return this.createDocumentUseCase.execute(userId, createDocumentDto);
    }

    @Get()
    async list(@Request() req, @Query('projectId') projectId?: string) {
        const userId = req.user.id;
        return this.listDocumentsUseCase.execute(userId, projectId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.getDocumentUseCase.execute(id);
    }

    @Put(':id')
    async update(
        @Request() req,
        @Param('id') id: string,
        @Body() updateDocumentDto: UpdateDocumentDto,
    ) {
        const userId = req.user.id;
        return this.updateDocumentUseCase.execute(id, userId, updateDocumentDto);
    }

    @Delete(':id')
    async remove(@Request() req, @Param('id') id: string) {
        const userId = req.user.id;
        return this.deleteDocumentUseCase.execute(id, userId);
    }
}
