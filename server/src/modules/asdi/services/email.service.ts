
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { SendEmailDto } from '../dto/email.dto';
import { EmailResponseDto } from '../dto/email-response.dto';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {

    console.log('[EmailService] Initializing and loading .env');

    // Load config from ASDI module's .env
    const envPath = path.resolve(__dirname, '../.env');
    dotenv.config({ path: envPath });

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('[EmailService] Missing SMTP credentials!', {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS ? '***' : undefined,
        envPath,
      });
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

    } catch (err) {
      console.error('[EmailService] Error creating transporter:', err);
    }

  }

  async sendEmail(params: SendEmailDto): Promise<EmailResponseDto> {
    console.log('[EmailService] sendEmail called with params:', params);
    // Normalize 'email recipient(s)' to array and display string
    const toList = Array.isArray(params.to) ? params.to : [params.to];
    const toDisplay = toList.join(', ');
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@tooljet.io',
        to: toList,
        subject: params.subject,
        html: params.body,
      };

      const result = await this.transporter.sendMail(mailOptions);
      return {
        id: result.messageId,
        status: 'OK',
        message: `Successfully sent email to ${toDisplay}`,
      };
    } catch (error) {
      console.error('[EmailService] Email sending failed:', error);
      return {
        status: 'Error',
        message: `Email sending failed to ${toDisplay}: ${error.message}`,
      };
    }
  }
}