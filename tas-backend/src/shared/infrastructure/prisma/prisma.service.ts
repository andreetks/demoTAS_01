import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    private client: any;

    constructor() {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new PrismaPg(pool);
        // Using any cast to bypass strict validation in canary/v7 client
        this.client = new (PrismaClient as any)({ adapter });
    }

    get user() { return this.client.user; }
    get document() { return this.client.document; }
    get chatMessage() { return this.client.chatMessage; }
    get project() { return this.client.project; }

    async $connect() {
        if (this.client.$connect) await this.client.$connect();
    }

    async $disconnect() {
        if (this.client.$disconnect) await this.client.$disconnect();
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
