import { Injectable, Inject } from '@nestjs/common';
import { UserRepository, USER_REPOSITORY } from '../../domain/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class ListUsersUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
    ) { }

    async execute(groupId: string, excludeUserId?: string): Promise<User[]> {
        const users = await this.userRepository.findByGroupId(groupId);
        if (excludeUserId) {
            return users.filter(user => user.id !== excludeUserId);
        }
        return users;
    }
}
