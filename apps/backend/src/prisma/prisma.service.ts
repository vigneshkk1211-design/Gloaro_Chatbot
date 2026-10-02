import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || dbUrl.includes('ep-xxxx') || dbUrl.includes('user:password')) {
      throw new InternalServerErrorException(
        '❌ DATABASE_URL is not configured properly in apps/backend/.env',
      );
    }

    super({
      log: [
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ],
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  async onModuleInit(): Promise<void> {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        await this.$connect();
        this.logger.log('✅ Prisma connected to local SQLite database');
        return;
      } catch (err: unknown) {
        attempt++;
        const isConnectionError =
          err instanceof Prisma.PrismaClientInitializationError &&
          (err.errorCode === 'P1001' || err.errorCode === 'P1003');

        if (isConnectionError && attempt < maxRetries) {
          this.logger.warn(`⚠️ Database connection failed (attempt ${attempt}/${maxRetries}). Retrying in 2s...`);
          await new Promise((r) => setTimeout(r, 2000));
        } else {
          this.logger.error('❌ Could not connect to database after retries.', String(err));
          throw err;
        }
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('🔌 Prisma disconnected');
  }
}
