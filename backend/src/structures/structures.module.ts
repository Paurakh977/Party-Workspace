import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StructuresService } from './structures.service';
import { Structures } from './structures.entity';
import { StructuresController } from './structures.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Structures])],
  providers: [StructuresService],
  exports: [StructuresService],
  controllers: [StructuresController],
})
export class StructuresModule {}
