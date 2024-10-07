import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from './settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepository: Repository<Settings>,
  ) {}

  // Retrieve all settings
  findAll(): Promise<Settings[]> {
    return this.settingsRepository.find();
  }

  // Retrieve a single setting by ID
  findOne(settingId: number): Promise<Settings> {
    return this.settingsRepository.findOneBy({ settingId });
  }

  async create(newSettingData: Partial<Settings>): Promise<Settings> {
    const newSetting = this.settingsRepository.create(newSettingData);
    return this.settingsRepository.save(newSetting);
  }

  // Update a setting by ID
  async update(
    settingId: number,
    updatedData: Partial<Settings>,
  ): Promise<Settings> {
    await this.settingsRepository.update({ settingId }, updatedData);
    // Return the updated setting
    return this.settingsRepository.findOneBy({ settingId });
  }

  // Remove a setting by ID
  async remove(settingId: number): Promise<void> {
    await this.settingsRepository.delete({ settingId });
  }
}
