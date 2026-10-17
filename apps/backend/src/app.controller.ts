import { Controller, Get } from '@nestjs/common';

// ─────────────────────────────────────────────────────────────────────────────
// AppController — Root health-check endpoint
//
// GET /  →  200 OK  { status, message, uptime, timestamp }
//
// Consumed by:
//   • UptimeRobot / external health monitors
//   • Browser root-path navigation
//   • Render / Railway / Railway deployment health probes
// ─────────────────────────────────────────────────────────────────────────────
@Controller()
export class AppController {
  @Get()
  healthCheck(): {
    status: string;
    message: string;
    uptime: number;
    timestamp: string;
  } {
    return {
      status:    'Online',
      message:   'Gloaro WhatsApp Bot Backend is running successfully! 🚀',
      uptime:    Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}
