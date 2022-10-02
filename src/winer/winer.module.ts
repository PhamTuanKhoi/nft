import { Module, forwardRef } from '@nestjs/common';
import { WinerService } from './winer.service';
import { WinerController } from './winer.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Winer } from './schema/winer.schema';
import { UserModule } from 'src/user/user.module';
import { BadgesModule } from 'src/badges/badges.module';

@Module({
  imports: [
    TypegooseModule.forFeature([Winer]),
    forwardRef(() => UserModule),
    forwardRef(() => BadgesModule),
  ],
  controllers: [WinerController],
  providers: [WinerService],
})
export class WinerModule {}
