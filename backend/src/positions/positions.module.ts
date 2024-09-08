import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionsService } from './positions.service';
import { Positions } from './positions.entity';
import { PositionsController } from './positions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Positions])],
  providers: [PositionsService],
  exports: [PositionsService],
  controllers: [PositionsController],
})
export class PositionsModule {}
