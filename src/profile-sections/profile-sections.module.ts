import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ProfileSectionsController } from './profile-sections.controller.js';
import { ProfileSectionsService } from './profile-sections.service.js';
import { ProfileSectionsScheduler } from './profile-sections.scheduler.js';

@Module({
  imports: [PrismaModule],
  controllers: [ProfileSectionsController],
  providers: [
    ProfileSectionsService,
    ProfileSectionsScheduler,
  ],
})
export class ProfileSectionsModule {}
