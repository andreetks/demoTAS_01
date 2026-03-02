import { Module } from '@nestjs/common';
import { RolesGuard } from './infrastructure/guards/roles.guard';

@Module({
    providers: [RolesGuard],
    exports: [RolesGuard],
})
export class PermissionsModule { }
