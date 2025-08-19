import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as dotenv from 'dotenv';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    // Load config from ASDI module's .env
    const envPath = path.resolve(__dirname, '../.env');
    dotenv.config({ path: envPath });

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(params: {
    to: string | string[];
    subject: string;
    body: string;
  }) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@tooljet.io',
        to: params.to,
        subject: params.subject,
        html: params.body,
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }
}