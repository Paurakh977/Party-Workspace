import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCommitteesService } from './sub-committees.service';
import { SubCommittees } from './sub-committees.entity';
import { SubCommitteesController } from './sub-committees.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SubCommittees])],
  providers: [SubCommitteesService],
  exports: [SubCommitteesService],
  controllers: [SubCommitteesController],
})
export class SubCommitteesModule {}
