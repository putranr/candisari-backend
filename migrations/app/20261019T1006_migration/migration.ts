#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/54c74a6efa410299e12ec789f174d968291b6bbb872099b9a70b5269e7919bbc/contract';
import endContract from '../../snapshots/54c74a6efa410299e12ec789f174d968291b6bbb872099b9a70b5269e7919bbc/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/d4067276b4379262894a15b249122c06e56802d24916077344b34c1e43d72d5f/contract';
import startContract from '../../snapshots/d4067276b4379262894a15b249122c06e56802d24916077344b34c1e43d72d5f/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'HomeSection',
        column: col('publishedSortOrder', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
