import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { WalkModule } from "@/src/walk/walk.module";

@Module({
  imports: [EventsModule, WalkModule],
})
export class AppModule {}
