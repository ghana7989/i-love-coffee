import { Injectable } from '@nestjs/common';
import { Coffee } from './entities/cofee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Cappuccino',
      brand: 'Starbucks',
      flavor: ['vanilla', 'caramel', 'chocolate'],
    },
  ];
  findAll(): Coffee[] {
    return this.coffees;
  }
  findOne(id: string): Coffee {
    return this.coffees.find((coffee) => coffee.id === +id);
  }
  create(createCoffeeDTO: any) {
    this.coffees.push(createCoffeeDTO);
  }
  update(id: string, updateCoffeeDTO: any) {
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
      existingCoffee.name = updateCoffeeDTO.name;
      existingCoffee.brand = updateCoffeeDTO.brand;
      existingCoffee.flavor = updateCoffeeDTO.flavor;
    }
  }
  remove(id: string) {
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
      this.coffees.splice(this.coffees.indexOf(existingCoffee), 1);
    }
  }
}
