export class Project {
    constructor(
        public readonly id: string,
        public name: string,
        public groupId: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public description?: string,
    ) { }
}
