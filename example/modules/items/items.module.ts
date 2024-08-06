import { Module } from '@nestjs/common';

import { ItemsService } from './application';
import { ItemsResolver } from './presentation';

@Module({
  providers: [ItemsResolver, ItemsService],
})
export class ItemsModule {}
