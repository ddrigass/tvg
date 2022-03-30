import { Module } from '@nestjs/common';
import { WalkGateway } from './walk.gateway';

@Module({
  providers: [WalkGateway],
})
export class WalkModule {}
