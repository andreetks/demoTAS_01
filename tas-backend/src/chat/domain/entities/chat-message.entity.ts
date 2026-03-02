export class ChatMessage {
    constructor(
        public readonly id: string,
        public readonly roomId: string,
        public readonly content: string,
        public readonly userId: string,
        public readonly userName: string,
        public readonly createdAt: Date,
    ) { }
}
