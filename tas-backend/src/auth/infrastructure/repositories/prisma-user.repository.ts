import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        return this.mapToEntity(user);
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) return null;
        return this.mapToEntity(user);
    }

    async create(data: { email: string; passwordHash: string; name: string, groupId?: string }): Promise<User> {
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                passwordHash: data.passwordHash,
                name: data.name,
                ...(data.groupId && { groupId: data.groupId }),
            },
        });
        return this.mapToEntity(user);
    }

    private mapToEntity(prismaUser: any): User {
        return new User(
            prismaUser.id,
            prismaUser.email,
            prismaUser.passwordHash,
            prismaUser.name,
            prismaUser.role,
            prismaUser.groupId,
            prismaUser.createdAt,
            prismaUser.updatedAt,
        );
    }
}
