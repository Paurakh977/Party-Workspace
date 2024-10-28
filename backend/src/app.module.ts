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
import { EventsModule } from './events/events.module';
import { MessagesModule } from './messages/messages.module';
import { MembersFinderModule } from './members-finder/members-finder.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SettingsModule } from './settings/settings.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PdfUploadModule } from './pdf-upload/pdf-upload.module';
import { CountryModule } from './country/country.module';
import { ProvinceModule } from './province/province.module';
import { DistrictModule } from './district/district.module';
import { MunicipalityModule } from './municipality/municipality.module';
import { SocialLinksModule } from './social-links/social-links.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST || 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME || 'nccCamp',
      password: process.env.DB_PASSWORD || 'mT9ugB8hRE@ent<>?#',
      database: process.env.DB_NAME || 'nc_campaign',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/images/logo'),
      serveRoot: '/images/logo/',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/images/carousel'),
      serveRoot: '/images/carousel/',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/pdf'),
      serveRoot: '/pdf/',
    }),
    CommitteesModule,
    SubCommitteesModule,
    LevelsModule,
    SubLevelModule,
    PositionsModule,
    StructuresModule,
    RepresentativesModule,
    MembersModule,
    EventsModule,
    MessagesModule,
    MembersFinderModule,
    UsersModule,
    AuthModule,
    SettingsModule,
    PdfUploadModule,
    CountryModule,
    ProvinceModule,
    DistrictModule,
    MunicipalityModule,
    SocialLinksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
