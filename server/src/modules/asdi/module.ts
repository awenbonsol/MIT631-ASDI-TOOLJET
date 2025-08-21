import { DynamicModule } from '@nestjs/common';
import { EmailController } from './controllers/email.controller';
import { EmailService } from './services/email.service';

export class AsdiModule {
  static async register(configs?: { IS_GET_CONTEXT: boolean }): Promise<DynamicModule> {
    return {
      module: AsdiModule,
      providers: [EmailService],
      controllers: configs?.IS_GET_CONTEXT ? [] : [EmailController],
      exports: [EmailService],
    };
  }
}