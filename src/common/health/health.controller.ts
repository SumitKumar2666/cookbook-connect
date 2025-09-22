import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'cookbook-connect-api',
    };
  }

  @Get('db')
  async checkDatabase() {
    return {
      status: 'ok',
      database: 'connected',
    };
  }
}