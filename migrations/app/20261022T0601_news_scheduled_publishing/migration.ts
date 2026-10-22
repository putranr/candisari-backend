#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/3adab5629ff08e3e040510ce892f9cf88b3d8b54f2ad8b412f35b594f08c4425/contract';
import startContract from '../../snapshots/3adab5629ff08e3e040510ce892f9cf88b3d8b54f2ad8b412f35b594f08c4425/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/cc686c9bf9fb30a17ada0f4ea1580fe7934682c6987674628a7bd08512d7f402/contract';
import endContract from '../../snapshots/cc686c9bf9fb30a17ada0f4ea1580fe7934682c6987674628a7bd08512d7f402/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropCheckConstraint({
        schema: 'public',
        table: 'News',
        constraint: 'News_status_check_bc64f66b',
      }),
      this.addColumn({
        schema: 'public',
        table: 'News',
        column: col('scheduledAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'News',
        constraint: 'News_status_check_90284fb2',
        expression: `"status" IN ('DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED')`,
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
