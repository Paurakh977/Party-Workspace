import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { Users } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId') userId: number): Promise<Users> {
    return this.usersService.findOne(userId);
  }

  @Post()
  create(@Body() user: Users): Promise<Users> {
    return this.usersService.create(user);
  }

  @Put(':userId')
  update(
    @Param('userId') userId: number,
    @Body() updatedData: Partial<Users>,
  ): Promise<Users> {
    return this.usersService.update(userId, updatedData);
  }

  @Get('/username/:username')
  async findUser(@Param('username') username: string): Promise<Users> {
    return this.usersService.findUser(username);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: number): Promise<void> {
    return this.usersService.remove(userId);
  }

  @Get('/credits/:userId')
  async findCredit(@Param('userId') userId: number): Promise<number> {
    return this.usersService.findCredit(userId);
  }
}
