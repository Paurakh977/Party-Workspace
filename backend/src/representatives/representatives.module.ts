import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepresentativesService } from './representatives.service';
import { Representatives } from './representatives.entity';
import { RepresentativesController } from './representatives.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Representatives])],
  providers: [RepresentativesService],
  exports: [RepresentativesService],
  controllers: [RepresentativesController],
})
export class RepresentativesModule {}
