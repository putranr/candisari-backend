#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/54ab9dcc87ec46f970d2ca9711e011f5e4f4d8c3ce2f40a13ef6f894b0252bec/contract';
import startContract from '../../snapshots/54ab9dcc87ec46f970d2ca9711e011f5e4f4d8c3ce2f40a13ef6f894b0252bec/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/d2f99b89da9300cfae177d60c0abafd1f31a9b2a3171b8e5a692defd134f5279/contract';
import endContract from '../../snapshots/d2f99b89da9300cfae177d60c0abafd1f31a9b2a3171b8e5a692defd134f5279/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'ActivityLog',
        columns: [
          col('action', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('adminId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('entityId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('module', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ActivityLog',
        index: 'ActivityLog_adminId_idx_530179db',
        columns: ['adminId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ActivityLog',
        index: 'ActivityLog_createdAt_idx_9575dbd7',
        columns: ['createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ActivityLog',
        index: 'ActivityLog_module_idx_dc74a7ea',
        columns: ['module'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ActivityLog',
        foreignKey: {
          name: 'ActivityLog_adminId_fkey',
          columns: ['adminId'],
          references: { schema: 'public', table: 'Admin', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
