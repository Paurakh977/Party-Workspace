import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { Users } from '../users/users.entity';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), UsersModule, JwtModule.register({
    secret: 'd3@f!G#h9$kL3mQv8sR2u^Z$wE*eN8xC'
  })],
  providers: [AuthService, UsersService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
