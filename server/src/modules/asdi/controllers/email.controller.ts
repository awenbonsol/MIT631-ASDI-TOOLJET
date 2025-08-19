import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmailService } from '../services/email.service';
import { JwtAuthGuard } from '../../session/guards/jwt-auth.guard';


@Controller('/api/asdi/email')
// @UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(private emailService: EmailService) {}

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