import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { CommitteesService } from './committees.service';
import { Committees } from './committees.entity';

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Controller('committees')
export class CommitteesController {
  constructor(private readonly committeesService: CommitteesService) {}

  @Get()
  findAll(@Query() query: PaginationQuery): Promise<PaginatedResult<Committees> | Committees[]> {
    if (query.page || query.limit || query.search) {
      return this.committeesService.findAllPaginated(query);
    }
    return this.committeesService.findAll();
  }

  @Get(':committeeId')
  findOne(@Param('committeeId') committeeId: number): Promise<Committees> {
    return this.committeesService.findOne(committeeId);
  }

  @Post()
  create(@Body() committee: Committees): Promise<Committees> {
    return this.committeesService.create(committee);
  }

  @Put(':committeeId')
  update(
    @Param('committeeId') committeeId: number,
    @Body() committee: Committees,
  ): Promise<Committees> {
    committee.committeeId = committeeId;
    return this.committeesService.update(committee);
  }

  @Delete(':committeeId')
  async remove(@Param('committeeId') committeeId: number): Promise<void> {
    await this.committeesService.remove(committeeId);
  }
}
