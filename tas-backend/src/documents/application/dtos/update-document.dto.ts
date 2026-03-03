import { IsString, IsOptional } from 'class-validator';

export class UpdateDocumentDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsOptional()
    content?: any;

    @IsOptional()
    projectId?: string;
}
