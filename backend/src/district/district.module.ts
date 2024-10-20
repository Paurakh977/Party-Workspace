import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictService } from './district.service';
import { District } from './district.entity';
import { DistrictController } from './district.controller';

@Module({
  imports: [TypeOrmModule.forFeature([District])],
  providers: [DistrictService],
  exports: [DistrictService],
  controllers: [DistrictController],
})
export class DistrictModule {}
