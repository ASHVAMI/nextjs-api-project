import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Welcome to the API!';
  }

  @Get('status')
  getStatus(): { status: string; message: string } {
    return {
      status: 'OK',
      message: 'API is running smoothly',
    };
  }
}
