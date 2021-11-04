import { Injectable } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Cappuccino',
      brand: 'Starbucks',
      flavors: ['vanilla', 'caramel', 'chocolate'],
    },
  ];
  findAll(): Coffee[] {
    return this.coffees;
  }
  findOne(id: string): Coffee {
    return this.coffees.find((coffee) => coffee.id === +id);
  }
  create(createCoffeeDTO: CreateCoffeeDto) {
    const newCoffee = {
      id: this.coffees.length + 1,
      name: createCoffeeDTO.name,
      brand: createCoffeeDTO.brand,
      flavors: createCoffeeDTO.flavors,
    };
    this.coffees.push(newCoffee);
  }
  update(id: string, updateCoffeeDTO: UpdateCoffeeDto) {
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
      existingCoffee.name = updateCoffeeDTO.name;
      existingCoffee.brand = updateCoffeeDTO.brand;
      existingCoffee.flavors = updateCoffeeDTO.flavors;
    }
  }
  remove(id: string) {
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
      this.coffees.splice(this.coffees.indexOf(existingCoffee), 1);
    }
  }
}
