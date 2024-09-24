import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { json } from 'stream/consumers';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) {}

    findAll(): Promise<Users[]> {
        return this.usersRepository.find();
    }

    findOne(userId: number): Promise<Users> {
        return this.usersRepository.findOneBy({ userId });
    }

    findUser(username: string): Promise<Users> {
        return this.usersRepository.findOneBy({ username });
    }

    async findCredit(userId: number): Promise<number> {
        const user = this.usersRepository.findOneBy({ userId });
        if (!user) {
            throw new Error('User not found');
        }
        return (await user).credits;
    }

    async create(user: Users): Promise<Users> {
        return this.usersRepository.save(user);
    }

    async update(
        userId: number,
        updatedData: Partial<Users>,
    ): Promise<Users> {
        const user = await this.findOne(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const updatedUser = Object.assign(user, updatedData);

        return this.usersRepository.save(updatedUser);
    }

    async remove(userId: number): Promise<void> {
        await this.usersRepository.delete({ userId });
    }
}
