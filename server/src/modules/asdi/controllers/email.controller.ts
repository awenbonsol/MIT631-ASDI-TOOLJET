
import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { SendEmailDto } from '../dto/email.dto';
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
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) payload: SendEmailDto
  ) {
    return await this.emailService.sendEmail(payload);
  }
}