// server/test/modules/asdi/email.controller.spec.ts
import { Test } from '@nestjs/testing';
import { INestApplication, CanActivate } from '@nestjs/common';
import * as request from 'supertest';

import { EmailController } from '@modules/asdi/controllers/email.controller';
import { EmailService } from '@modules/asdi/services/email.service';
import { JwtAuthGuard } from '@modules/session/guards/jwt-auth.guard';

class MockAuthGuard implements CanActivate {
  canActivate() {
    return true; // allow all requests in tests
  }
}

describe('EmailController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest
              .fn()
              .mockResolvedValue({ success: true, messageId: 'mock-id' }),
          },
        },
        // make sure Nest can resolve JwtAuthGuard used by @UseGuards(...)
        { provide: JwtAuthGuard, useClass: MockAuthGuard },
      ],
    })
      // also explicitly override it (belt & suspenders)
      .overrideGuard(JwtAuthGuard)
      .useValue(new MockAuthGuard())
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('/api/asdi/email/send (POST)', async () => {
    const payload = { to: 'test@example.com', subject: 'Hi', body: '<p>Hello</p>' };

    await request(app.getHttpServer())
      .post('/api/asdi/email/send')
      .send(payload)
      .expect(201)
      .expect({ success: true, messageId: 'mock-id' });
  });
});
