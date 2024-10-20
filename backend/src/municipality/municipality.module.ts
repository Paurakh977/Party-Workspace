import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MunicipalityService } from './municipality.service';
import { Municipality } from './municipality.entity';
import { MunicipalityController } from './municipality.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Municipality])],
  providers: [MunicipalityService],
  exports: [MunicipalityService],
  controllers: [MunicipalityController],
})
export class MunicipalityModule {}
