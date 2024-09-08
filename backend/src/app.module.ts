import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommitteesModule } from './committees/committees.module';
import { SubCommitteesModule } from './sub-committees/sub-committees.module';
import { LevelsModule } from './levels/levels.module';
import { SubLevelModule } from './sub-level/sub-level.module';
import { PositionsModule } from './positions/positions.module';
import { StructuresModule } from './structures/structures.module';
import { RepresentativesModule } from './representatives/representatives.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'nccCamp',
      password: 'mT9ugB8hRE@ent<>?#',
      database: 'nc_campaign',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    CommitteesModule,
    SubCommitteesModule,
    LevelsModule,
    SubLevelModule,
    PositionsModule,
    StructuresModule,
    RepresentativesModule,
    MembersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
