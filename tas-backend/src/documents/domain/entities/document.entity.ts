export class Document {
    constructor(
        public readonly id: string,
        public title: string,
        public content: string,
        public readonly ownerId: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }
}
