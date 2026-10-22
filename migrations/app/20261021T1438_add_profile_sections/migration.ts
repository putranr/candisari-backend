#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/54c74a6efa410299e12ec789f174d968291b6bbb872099b9a70b5269e7919bbc/contract';
import startContract from '../../snapshots/54c74a6efa410299e12ec789f174d968291b6bbb872099b9a70b5269e7919bbc/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ba0264a6dc9b4b3d55a73f2327e9bbc0ab7f49b330e40a2991947df183ea4bec/contract';
import endContract from '../../snapshots/ba0264a6dc9b4b3d55a73f2327e9bbc0ab7f49b330e40a2991947df183ea4bec/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'ProfileSection',
        columns: [
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('coverImage', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('publishedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('scheduledAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('sectionType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sortOrder', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('DRAFT'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('summary', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'ProfileSection_status_check_90284fb2',
            `"status" IN ('DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED')`,
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'ProfileSection',
        constraint: 'ProfileSection_slug_key',
        columns: ['slug'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProfileSection',
        index: 'ProfileSection_publishedAt_idx_36121b91',
        columns: ['publishedAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProfileSection',
        index: 'ProfileSection_scheduledAt_idx_f69c1204',
        columns: ['scheduledAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProfileSection',
        index: 'ProfileSection_sectionType_idx_509edf93',
        columns: ['sectionType'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProfileSection',
        index: 'ProfileSection_sortOrder_idx_ebf2eac2',
        columns: ['sortOrder'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ProfileSection',
        index: 'ProfileSection_status_idx_e98638ab',
        columns: ['status'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
