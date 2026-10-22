import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MailModule } from '../mail/mail.module.js';
import { AdminInvitationsController } from './admin-invitations.controller.js';
import { AdminInvitationsService } from './admin-invitations.service.js';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [AdminInvitationsController],
  providers: [AdminInvitationsService],
})
export class AdminInvitationsModule {}