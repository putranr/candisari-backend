#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/8a1950bc73b271ea4742d5ff2d30bd4d4f8673ed3a622232970094fdff3b7be2/contract';
import endContract from '../../snapshots/8a1950bc73b271ea4742d5ff2d30bd4d4f8673ed3a622232970094fdff3b7be2/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/ce632181ee5fa5935a7168a37ca2ec0666c66db92ebd313ce450d3e26e0dafaf/contract';
import startContract from '../../snapshots/ce632181ee5fa5935a7168a37ca2ec0666c66db92ebd313ce450d3e26e0dafaf/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'HomeSection',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('sectionKey', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sortOrder', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'HomeSection',
        constraint: 'HomeSection_sectionKey_key',
        columns: ['sectionKey'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
