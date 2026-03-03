export class User {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public passwordHash: string,
        public name: string,
        public role: 'ADMIN' | 'MEMBER',
        public groupId: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }
}
