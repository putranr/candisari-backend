#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/ce632181ee5fa5935a7168a37ca2ec0666c66db92ebd313ce450d3e26e0dafaf/contract';
import endContract from '../../snapshots/ce632181ee5fa5935a7168a37ca2ec0666c66db92ebd313ce450d3e26e0dafaf/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/d2f99b89da9300cfae177d60c0abafd1f31a9b2a3171b8e5a692defd134f5279/contract';
import startContract from '../../snapshots/d2f99b89da9300cfae177d60c0abafd1f31a9b2a3171b8e5a692defd134f5279/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'WebsiteVisit',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('ipHash', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('path', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sessionId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('userAgent', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('visitedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'WebsiteVisit',
        index: 'WebsiteVisit_path_idx_a72f861c',
        columns: ['path'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'WebsiteVisit',
        index: 'WebsiteVisit_sessionId_idx_29f415d4',
        columns: ['sessionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'WebsiteVisit',
        index: 'WebsiteVisit_visitedAt_idx_c892254a',
        columns: ['visitedAt'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
