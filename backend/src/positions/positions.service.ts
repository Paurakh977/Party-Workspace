import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Positions } from './positions.entity';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Positions)
    private positionsRepository: Repository<Positions>,
  ) {}

  findAll(): Promise<Positions[]> {
    return this.positionsRepository.find();
  }

  findOne(positionId: number): Promise<Positions> {
    return this.positionsRepository.findOne({ where: { positionId } });
  }

  create(position: Positions): Promise<Positions> {
    return this.positionsRepository.save(position);
  }

  async remove(positionId: number): Promise<void> {
    await this.positionsRepository.delete(positionId);
  }
}
