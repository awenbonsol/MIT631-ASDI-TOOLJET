
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmailService } from '../services/email.service';
// import { JwtAuthGuard } from '../../session/guards/jwt-auth.guard';

@Controller('/asdi/email')
// @UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(private emailService: EmailService) {
    console.log('[EmailController] Initialized');
  }

  @Post('send')
  async sendEmail(
    @Body()
    payload: {
      to: string;
      subject: string;
      body: string;
    }
  ) {
    return await this.emailService.sendEmail(payload);
  }
}