import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { RegisterDto } from '../../application/dtos/register.dto';
import { LoginDto } from '../../application/dtos/login.dto';
import { JwtAuthGuard } from '../../infrastructure/guards/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerUseCase: RegisterUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly listUsersUseCase: ListUsersUseCase,
    ) { }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.registerUseCase.execute(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
        return this.loginUseCase.execute(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('users/members')
    async listMembers(@Request() req) {
        const groupId = req.user.groupId;
        const userId = req.user.id;
        return this.listUsersUseCase.execute(groupId, userId);
    }
}
