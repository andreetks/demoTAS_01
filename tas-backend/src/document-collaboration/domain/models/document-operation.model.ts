export interface DocumentOperation {
    documentId: string;
    userId: string;
    operationType: string;
    data: any;
    timestamp: Date;
}
