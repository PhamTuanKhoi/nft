import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CollectionModule } from 'src/collection/collection.module';
import { MiningModule } from 'src/mining/mining.module';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';
import { NFT } from './schema/nft.schema';

@Module({
  imports: [TypegooseModule.forFeature([NFT]), MiningModule, CollectionModule],
  controllers: [NftController],
  providers: [NftService],
  exports: [NftService],
})
export class NftModule {}
