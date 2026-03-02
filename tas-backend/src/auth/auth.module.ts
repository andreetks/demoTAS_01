import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/guards/jwt.guard';
import { AuthController } from './presentation/controllers/auth.controller';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { USER_REPOSITORY } from './domain/interfaces/user.repository.interface';
import { SharedModule } from '../shared/shared.module';

@Module({
    imports: [
        SharedModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'tas-super-secret-jwt-key-2024',
            signOptions: { expiresIn: '8h' },
        }),
    ],
    controllers: [AuthController],
    providers: [
        JwtStrategy,
        JwtAuthGuard,
        RegisterUseCase,
        LoginUseCase,
        {
            provide: USER_REPOSITORY,
            useClass: PrismaUserRepository,
        },
    ],
    exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule { }
