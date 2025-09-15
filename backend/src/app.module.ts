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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SettingsModule } from './settings/settings.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PdfUploadModule } from './pdf-upload/pdf-upload.module';
import { CountryModule } from './country/country.module';
import { ProvinceModule } from './province/province.module';
import { DistrictModule } from './district/district.module';
import { MunicipalityModule } from './municipality/municipality.module';
import { SocialLinksModule } from './social-links/social-links.module';
import { EventImagesModule } from './event-images/event-images.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (config) => {
        // Only require host, username and database name
        const requiredEnvVars = ['DB_HOST', 'DB_USERNAME', 'DB_NAME'];
        const missingVars = requiredEnvVars.filter(envVar => !config[envVar]);
        
        if (missingVars.length > 0) {
          throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }
        return config;
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log('=== Environment Variables Debug ===');
        console.log('DB_HOST:', configService.get('DB_HOST'));
        console.log('DB_USERNAME:', configService.get('DB_USERNAME'));
        console.log('DB_NAME:', configService.get('DB_NAME'));
        console.log('DB_PASSWORD:', configService.get('DB_PASSWORD') ? '[SET]' : '[NOT SET]');
        console.log('PORT:', configService.get('PORT'));
        console.log('==================================');

        const dbConfig: any = {
          type: 'mariadb' as const,
          host: configService.get('DB_HOST'),
          port: 3306,
          username: configService.get('DB_USERNAME'),
          database: configService.get('DB_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
        
        // Only add password if it's set in environment variables
        const password = configService.get('DB_PASSWORD');
        if (password) {
          dbConfig.password = password;
        }
        
        console.log('Database configuration:', JSON.stringify(dbConfig, null, 2));
        return dbConfig;
      },
      inject: [ConfigService],
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
      rootPath: join(__dirname, '..', 'public/images/events'),
      serveRoot: '/images/events/',
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
    EventImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
