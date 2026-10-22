import { Module } from '@nestjs/common';
import { db } from './db.js';

@Module({
  providers: [
    {
      provide: 'PRISMA_DB',
      useValue: db,
    },
  ],
  exports: ['PRISMA_DB'],
})
export class PrismaModule {}