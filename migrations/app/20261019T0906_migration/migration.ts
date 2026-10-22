#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/8a1950bc73b271ea4742d5ff2d30bd4d4f8673ed3a622232970094fdff3b7be2/contract';
import startContract from '../../snapshots/8a1950bc73b271ea4742d5ff2d30bd4d4f8673ed3a622232970094fdff3b7be2/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/d4067276b4379262894a15b249122c06e56802d24916077344b34c1e43d72d5f/contract';
import endContract from '../../snapshots/d4067276b4379262894a15b249122c06e56802d24916077344b34c1e43d72d5f/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'HomeSection',
        column: col('publishedAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'HomeSection',
        column: col('scheduledAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'HomeSection',
        column: col('status', 'text', {
          notNull: true,
          default: lit('DRAFT'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'HomeSection',
        constraint: 'HomeSection_status_check_6682f995',
        expression: `"status" IN ('DRAFT', 'PUBLISHED', 'SCHEDULED')`,
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
