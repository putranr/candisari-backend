import { Module } from '@nestjs/common';
import { AgendaService } from './agenda.service.js';
import { AgendaController } from './agenda.controller.js';

@Module({
  providers: [AgendaService],
  controllers: [AgendaController]
})
export class AgendaModule {}
