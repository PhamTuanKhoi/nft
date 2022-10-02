import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { Collection } from './schema/collection.schema';

@Module({
  imports: [TypegooseModule.forFeature([Collection])],
  controllers: [CollectionController],
  providers: [CollectionService],
  exports: [CollectionService],
})
export class CollectionModule {}
