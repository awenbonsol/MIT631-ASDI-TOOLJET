// import { Test } from '@nestjs/testing';
// import { EmailService } from '@modules/asdi/services/email.service';
// import { ConfigService } from '@nestjs/config';

// describe('EmailService', () => {
//   let emailService: EmailService;

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       providers: [
//         EmailService,
//         {
//           provide: ConfigService,
//           useValue: {
//             get: jest.fn((key) => {
//               switch (key) {
//                 case 'SMTP_HOST':
//                   return 'smtp.gmail.com';
//                 case 'SMTP_PORT':
//                   return '587';
//                 default:
//                   return '';
//               }
//             }),
//           },
//         },
//       ],
//     }).compile();

//     emailService = moduleRef.get<EmailService>(EmailService);
//   });

//   it('should send email', async () => {
//     const result = await emailService.sendEmail({
//       to: 'test@example.com',
//       subject: 'Test Email',
//       body: '<h1>Test</h1>'
//     });

//     expect(result.success).toBeTruthy();
//   });
// });

// email.service.spec.ts
import { Test } from '@nestjs/testing';
import { EmailService } from '@modules/asdi/services/email.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer'); // 👈 mock the whole nodemailer module

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(async () => {
    // Mock nodemailer.createTransport().sendMail()
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              switch (key) {
                case 'SMTP_HOST':
                  return 'smtp.gmail.com';
                case 'SMTP_PORT':
                  return '587';
                default:
                  return '';
              }
            }),
          },
        },
      ],
    }).compile();

    emailService = moduleRef.get<EmailService>(EmailService);
  });

  it('should send email', async () => {
    const result = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test Email',
      body: '<h1>Test</h1>',
    });

    expect(result.success).toBeTruthy();
    expect(result.messageId).toBe('test-message-id');
  });
});
