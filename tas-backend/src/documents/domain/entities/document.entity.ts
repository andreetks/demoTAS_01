export class Document {
    constructor(
        public readonly id: string,
        public title: string,
        public content: any,
        public readonly ownerId: string,
        public projectId: string | null = null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }
}
