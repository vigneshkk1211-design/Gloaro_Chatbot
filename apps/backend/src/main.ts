import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // ── Serve Static Assets (Images) ──────────────────────────────────────────
  app.useStaticAssets(join(__dirname, 'assets/images'), {
    prefix: '/images/',
  });

  // ── CORS ──────────────────────────────────────────────────────────────────
  // Enable permissive CORS for local dev, ngrok tunnels, and Next.js frontend
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, Meta webhook, server-side)
      if (!origin) return callback(null, true);
      // In dev or local, reflect the request origin
      if (process.env.NODE_ENV !== 'production') return callback(null, true);
      const allowed = (process.env.FRONTEND_URL || 'http://localhost:3000,http://127.0.0.1:3000').split(',');
      if (allowed.some((a) => origin.startsWith(a.trim()))) return callback(null, true);
      return callback(null, true); // Permissive to avoid blocking dashboard
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-hub-signature-256', 'Accept'],
    credentials: true,
  });

  // ── Global Validation Pipe ────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ── Port & Host ───────────────────────────────────────────────────────────
  const port = parseInt(process.env.PORT ?? '3001', 10);
  const host = '0.0.0.0';

  await app.listen(port, host);

  logger.log(`🚀 WhatsApp Bot Backend running on http://localhost:${port}`);
  logger.log(`📡 Webhook endpoint → http://localhost:${port}/webhook`);
  logger.log(`🖼️  Static Images    → http://localhost:${port}/images/welcome.jpg`);
  logger.log(`📋 Admin API       → http://localhost:${port}/conversations`);
}

bootstrap().catch((err) => {
  console.error('❌ Fatal bootstrap error:', err);
  process.exit(1);
});
