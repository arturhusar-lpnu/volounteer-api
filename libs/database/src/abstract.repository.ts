import { NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

export interface IBaseRepository<T> {
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(data: DeepPartial<T>): Promise<T>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;
  findOneById(id: string): Promise<T>;
  findByCondition(filterCondition: FindOneOptions<T>): Promise<T>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  remove(data: T): Promise<T>;
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;
  preload(entityLike: DeepPartial<T>): Promise<T>;
  findOne(options: FindOneOptions<T>): Promise<T>;
}

interface HasId {
  id: string;
}

export abstract class BaseRepostitory<T extends HasId>
  implements IBaseRepository<T>
{
  private entity: Repository<T>;
  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return this.entity.save(data);
  }

  public create(data: DeepPartial<T>): T {
    return this.entity.create(data);
  }

  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data);
  }

  public async findOneById(id: string): Promise<T> {
    const found = await this.entity.findOneBy({ id } as FindOptionsWhere<T>);

    if (!found) throw new NotFoundException('Document was not found');
    return found;
  }

  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    const found = await this.entity.findOne(filterCondition);

    if (!found) throw new NotFoundException('Document was not found');

    return found;
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(relations);
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options);
  }

  public async remove(data: T): Promise<T> {
    return await this.entity.remove(data);
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    const preload = await this.entity.preload(entityLike);

    if (!preload) throw new NotFoundException('Document cannot preload');

    return preload;
  }

  public async findOne(options: FindOneOptions<T>): Promise<T> {
    const found = await this.entity.findOne(options);

    if (!found) throw new NotFoundException('Document was not found');

    return found;
  }
}
