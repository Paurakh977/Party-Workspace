import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinceService } from './province.service';
import { Province } from './province.entity';
import { ProvinceController } from './province.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Province])],
  providers: [ProvinceService],
  exports: [ProvinceService],
  controllers: [ProvinceController],
})
export class ProvinceModule {}
