import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDocumentDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    content?: any;

    @IsOptional()
    @IsString()
    projectId?: string;
}
