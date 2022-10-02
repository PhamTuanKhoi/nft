import { Module, forwardRef } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { BadgesController } from './badges.controller';
import { Badges } from './schema/badges.schema';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypegooseModule.forFeature([Badges]), forwardRef(() => UserModule)],
  controllers: [BadgesController],
  providers: [BadgesService],
  exports: [BadgesService],
})
export class BadgesModule {}
