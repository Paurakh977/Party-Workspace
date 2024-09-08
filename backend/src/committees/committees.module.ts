import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommitteesService } from './committees.service';
import { Committees } from './committees.entity';
import { CommitteesController } from './committees.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Committees])],
  providers: [CommitteesService],
  exports: [CommitteesService],
  controllers: [CommitteesController],
})
export class CommitteesModule {}
