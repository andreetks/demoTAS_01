import { Injectable, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository, USER_REPOSITORY } from '../../domain/interfaces/user.repository.interface';
import { RegisterDto } from '../dtos/register.dto';

@Injectable()
export class RegisterUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) { }

    async execute(dto: RegisterDto): Promise<{ access_token: string }> {
        const existing = await this.userRepository.findByEmail(dto.email);
        if (existing) {
            throw new ConflictException('Email already in use');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.userRepository.create({
            email: dto.email,
            passwordHash,
            name: dto.name,
            groupId: dto.groupId,
        });

        const payload = { sub: user.id, email: user.email, role: user.role, groupId: user.groupId, name: user.name };
        return { access_token: this.jwtService.sign(payload) };
    }
}
