import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { Connection, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<Coffee[]> {
    return await this.coffeeRepository.find({
      order: {
        id: 'ASC',
      },
      relations: ['flavors'],
      skip: paginationQuery.offset,
      take: paginationQuery.limit,
    });
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne(+id, {
      relations: ['flavors'],
      order: {
        id: 'ASC',
      },
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee with id- ${id} is NOT found`);
    }
    return coffee;
  }

  async create(createCoffeeDTO: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDTO.flavors.map(async (flavorName: string) => {
        return await this.preloadFlavorByName(flavorName);
      }),
    );
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDTO,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDTO: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDTO.flavors.length &&
      (await Promise.all(
        updateCoffeeDTO.flavors.map(async (flavorName: string) => {
          return await this.preloadFlavorByName(flavorName);
        }),
      ));
    // preload here first checks for the given id and then updates if there is no row with that id
    // it will return undefined
    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDTO,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee with id- ${id} is NOT found`);
    }
    return await this.coffeeRepository.save(coffee);
  }

  async remove(id: string) {
    const existingCoffee = await this.findOne(id);
    if (existingCoffee) {
      this.coffeeRepository.remove(existingCoffee);
    }
  }
  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      coffee.recommendations++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = {
        coffeeId: coffee.id,
      };
      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const flavor = await this.flavorRepository.findOne({
      name,
    });
    if (flavor) {
      return flavor;
    }
    return this.flavorRepository.create({
      name,
    });
  }
}
