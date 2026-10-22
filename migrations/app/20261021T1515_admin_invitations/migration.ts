#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3adab5629ff08e3e040510ce892f9cf88b3d8b54f2ad8b412f35b594f08c4425/contract';
import endContract from '../../snapshots/3adab5629ff08e3e040510ce892f9cf88b3d8b54f2ad8b412f35b594f08c4425/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/ba0264a6dc9b4b3d55a73f2327e9bbc0ab7f49b330e40a2991947df183ea4bec/contract';
import startContract from '../../snapshots/ba0264a6dc9b4b3d55a73f2327e9bbc0ab7f49b330e40a2991947df183ea4bec/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'AdminInvitationToken',
        columns: [
          col('adminId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tokenHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('usedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'AdminInvitationToken',
        constraint: 'AdminInvitationToken_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AdminInvitationToken',
        index: 'AdminInvitationToken_adminId_idx_530179db',
        columns: ['adminId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AdminInvitationToken',
        index: 'AdminInvitationToken_expiresAt_idx_6b6b8c10',
        columns: ['expiresAt'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AdminInvitationToken',
        foreignKey: {
          name: 'AdminInvitationToken_adminId_fkey',
          columns: ['adminId'],
          references: { schema: 'public', table: 'Admin', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
